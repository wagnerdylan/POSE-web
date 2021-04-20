/// Utility message for vector data
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Vec3D {
    #[prost(double, tag="1")]
    pub x: f64,
    #[prost(double, tag="2")]
    pub y: f64,
    #[prost(double, tag="3")]
    pub z: f64,
}
/// Data for a single solar object
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SolarObjData {
    /// Which solar object
    #[prost(enumeration="SolarObj", tag="1")]
    pub solar_obj: i32,
    /// Absolute coords of solar object
    #[prost(message, optional, tag="2")]
    pub abs_coord: ::core::option::Option<Vec3D>,
    /// Velocity of solar object
    #[prost(message, optional, tag="3")]
    pub velocity: ::core::option::Option<Vec3D>,
}
/// Data for a single simulation object
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SimObjData {
    /// ID of the simulation object
    #[prost(uint64, tag="1")]
    pub id: u64,
    /// Sphere of influnce of simulation object
    #[prost(enumeration="SolarObj", tag="2")]
    pub soi: i32,
    /// Absolute coords of simulation object
    #[prost(message, optional, tag="3")]
    pub abs_coord: ::core::option::Option<Vec3D>,
    /// Velocity of simulation object
    #[prost(message, optional, tag="4")]
    pub velocity: ::core::option::Option<Vec3D>,
}
/// Atomic simulation update message for a given simulation time. 
/// This message includes (objects):
///  (1) all solar objects tracked within the simulation. 
///  (2) all watched simulation objects requested by the webview.
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SimUpdate {
    /// Simulation time of the update
    #[prost(double, tag="1")]
    pub sim_time: f64,
    /// Solar object simulation data
    #[prost(message, repeated, tag="2")]
    pub solar_obj_update: ::prost::alloc::vec::Vec<SolarObjData>,
    /// Simulation object data
    #[prost(message, repeated, tag="3")]
    pub sim_obj_update: ::prost::alloc::vec::Vec<SimObjData>,
}
/// Data request for a single simulation object
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SimObjRequest {
    /// ID of the simulation object
    #[prost(uint64, tag="1")]
    pub id: u64,
    /// Should include velocity within the data sent over
    #[prost(bool, tag="2")]
    pub send_velocity: bool,
}
/// Simulation data request
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SimDataRequest {
    /// Start of simulation data request
    #[prost(double, tag="1")]
    pub sim_time_start: f64,
    /// End of simulation data request
    #[prost(double, tag="2")]
    pub sim_time_end: f64,
    /// Should send simulation density chunks
    #[prost(bool, tag="3")]
    pub send_density_chunks: bool,
    /// Request information for each simulation object request by view
    #[prost(message, repeated, tag="4")]
    pub sim_obj_ids: ::prost::alloc::vec::Vec<SimObjRequest>,
}
/// Requests sent from client to server
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SimRequest {
    #[prost(oneof="sim_request::Request", tags="1")]
    pub request: ::core::option::Option<sim_request::Request>,
}
/// Nested message and enum types in `SimRequest`.
pub mod sim_request {
    #[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Request {
        #[prost(message, tag="1")]
        SimDataRequest(super::SimDataRequest),
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum SolarObj {
    Sun = 0,
    Earth = 1,
    Moon = 2,
}
