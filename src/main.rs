use actix::prelude::*;
use actix_files::Files;
use actix_web::{web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use futures::future;
use futures_util::{
    stream::{once, repeat, repeat_with},
    StreamExt,
};
use prost::Message;
use sim::{SimObjData, SimRequest, SimUpdate, SolarObj, SolarObjData, Vec3D};

mod sim;

fn parse_client_request(msg: Result<ws::Message, ws::ProtocolError>) -> SimRequest {
    todo!();
}

#[derive(MessageResponse)]
struct SimDataChunkStatus;

#[derive(actix::Message)]
#[rtype(result = "()")]
struct SimDataChunk {
    seq_num: usize,
    data: Vec<u8>,
}

async fn produce_data_chunk() -> SimDataChunk {
    let sim_update = sim::SimUpdate {
        sim_time: 0.0,
        day: 0.0,
        solar_obj_update: vec![
            sim::SolarObjData {
                solar_obj: SolarObj::Sun as i32,
                abs_coord: Some(Vec3D {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0,
                }),
                velocity: None,
            },
            sim::SolarObjData {
                solar_obj: SolarObj::Earth as i32,
                abs_coord: Some(Vec3D {
                    x: -124443530000.0,
                    y: -84562370000.0,
                    z: 0.0,
                }),
                velocity: None,
            },
            sim::SolarObjData {
                solar_obj: SolarObj::Moon as i32,
                abs_coord: Some(Vec3D {
                    x: -124381930000.0,
                    y: -84954600000.0,
                    z: 7120020.0,
                }),
                velocity: None,
            },
        ],
        sim_obj_update: vec![SimObjData {
            id: 0,
            soi: SolarObj::Earth as i32,
            abs_coord: Some(Vec3D {
                x: -126036384768.44054,
                y: -82078041105.70326,
                z: -4800.139863,
            }),
            velocity: None,
        }],
    };

    let mut buf = Vec::<u8>::new();
    sim_update.encode(&mut buf).unwrap();
    SimDataChunk {
        seq_num: 0,
        data: buf,
    }
}

struct SimWs {}

impl Handler<SimDataChunk> for SimWs {
    type Result = ();

    fn handle(&mut self, msg: SimDataChunk, ctx: &mut Self::Context) {
        ctx.binary(msg.data);
    }
}

impl Actor for SimWs {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.add_message_stream(once(produce_data_chunk()));
    }
}

/// Handler for ws::Message message
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for SimWs {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        let sim_client_request = parse_client_request(msg);

        if let Some(request) = sim_client_request.request {
            match request {
                sim::sim_request::Request::SimDataRequest(data_request) => {
                    let num_chunks =
                        ((data_request.sim_time_end - data_request.sim_time_start) / 2f64) as i64;
                    if num_chunks <= 0 {
                        // This should never happen
                        return;
                    }

                    for i in 0..num_chunks {
                        ctx.add_message_stream(once(produce_data_chunk()));
                    }
                }
            }
        }
    }
}

async fn ws_index(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    ws::start(SimWs {}, &req, stream)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(web::resource("/ws/").route(web::get().to(ws_index)))
            .service(Files::new("/", "./web/dist/").index_file("index.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
