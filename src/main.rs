use actix::prelude::*;
use actix_files::Files;
use actix_web::{web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use futures::future;
use futures_util::{
    stream::{once, repeat, repeat_with},
    StreamExt,
};
use sim::{SimObjData, SimRequest, SolarObj, SolarObjData, Vec3D};

mod sim;

fn parse_client_request(msg: Result<ws::Message, ws::ProtocolError>) -> SimRequest {
    let sim_update = sim::SimUpdate {
        sim_time: 0.0,
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
                    x: -126036190000.0,
                    y: -82084790000.0,
                    z: 0.0,
                }),
                velocity: None,
            },
            sim::SolarObjData {
                solar_obj: SolarObj::Moon as i32,
                abs_coord: Some(Vec3D {
                    x: -126074370000.0,
                    y: -82475070000.0,
                    z: 15229297.0,
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
    todo!();
}

struct SimDataChunk {
    seq_num: usize,
}

fn produce_data_chunk() -> SimDataChunk {
    todo!()
}

struct SimWs {
    spawn_handle: Option<SpawnHandle>,
}

impl StreamHandler<SimDataChunk> for SimWs {
    fn handle(&mut self, item: SimDataChunk, ctx: &mut Self::Context) {
        todo!()
    }
}

impl Actor for SimWs {
    type Context = ws::WebsocketContext<Self>;
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

                    self.spawn_handle = Some(
                        ctx.add_stream(
                            repeat_with(|| {
                                let mut curr_chunk = 0 as usize;
                                let data_chunk = produce_data_chunk();
                                curr_chunk += 1;
                                data_chunk
                            })
                            .take(num_chunks as usize),
                        ),
                    );
                }
            }
        }
    }
}

async fn ws_index(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    ws::start(SimWs { spawn_handle: None }, &req, stream)
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
