fn main() {
    let mut prost_build = prost_build::Config::new();
    prost_build
        .out_dir("./src")
        .protoc_arg("--experimental_allow_proto3_optional")
        .compile_protos(&["proto/sim.proto"], &["proto/"])
        .unwrap();
}
