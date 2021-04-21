
class SimDataBuffer {

    constructor() {
        this.sim_data_buffer = new Array();
    }

    clear_sim_array() {
        this.sim_data_buffer.length = 0;
    }

    /**
     *  Insert simulation data into the array, maintains order
     * 
     * @param {SimUpdate} sim_data Simulation data to be inserted
     */
    insert_sim_data(sim_data) {
        // Naive sorted insert
        this.sim_data_buffer.insert(sim_data);
        this.sim_data_buffer.sort((a, b) => a.getSimTime() - b.getSimTime());
    }

    * get_sim_data_range(start_time, end_time) {

    }
}

export { SimDataBuffer };