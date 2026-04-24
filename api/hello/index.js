const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const config = {
            connectionString: process.env.SQL_CONNECTION_STRING
        };

        await sql.connect(config);

        const result = await sql.query(`
            SELECT TOP 10
                FechaCC,
                Turno,
                Grupo,
                Parametro,
                Hora_Registro,
                NroOrden,
                Valor,
                ValorNum
            FROM dbo.vw_ControlProduccion_Final
            ORDER BY FechaCC DESC, NroOrden DESC
        `);

        context.res = {
            status: 200,
            body: result.recordset
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: error.message
        };
    }
};
