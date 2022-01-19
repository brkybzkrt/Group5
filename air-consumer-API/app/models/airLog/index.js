const pg_client = require("../../adapters/database/postgresql");


const airLogger= async(school_id, class_id, sensor_id, sensor_data, read_at)=>{

    const text="insert into log_air_quality (school_id, class_id, sensor_id, sensor_data, read_at) values ($1,$2,$3,$4,$5) returning *"
    
    const values =[school_id, class_id, sensor_id, sensor_data, read_at];

    await pg_client.query(text, values);

}



module.exports =airLogger