fn main() {
    prost_build::compile_protos(&["proto/sim.proto"], &["proto/"]).unwrap();
}
