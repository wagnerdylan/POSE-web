
/**
 * Class used for reporting of data buffer state to UI elements
 */
class DataBufferInfo {
    constructor(data_start, data_end){
        this.data_start = data_start;
        this.data_end = data_end;
    }
}

class SimDataBuffer {

    constructor(data_ingest_callback) {
        this.sim_data_buffer = new Array();
        // Callback used to update data buffer UI scrubber
        this.data_ingest_callback = data_ingest_callback;
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
        this.sim_data_buffer.push(sim_data);
        this.sim_data_buffer.sort((a, b) => a.getSimTime() - b.getSimTime());
    }

    * get_sim_data_range(start_time, end_time) {
        let index = 0;

        while (true){

            // Need more data
            if(index >= this.sim_data_buffer.length) {
                yield null;
            } else {
                var data_at_index = this.sim_data_buffer[index];
                index += 1;

                if (data_at_index.getSimTime() >= end_time){ // Done feeding data
                    return data_at_index;
                } else {
                    yield data_at_index;
                }
            }
        }
    }
}

export { SimDataBuffer };