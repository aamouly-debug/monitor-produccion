const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const connectionString = process.env.SQL_CONNECTION_STRING;

        await sql.connect(connectionString);

        const result = await sql.query(`
            SELECT TOP 1 FechaCC, Turno
            FROM dbo.vw_ControlProduccion_Final
            WHERE ValorNum IS NOT NULL
            ORDER BY FechaCC DESC, Turno DESC
        `);

        context.res = {
            status: 200,
            body: result.recordset[0]
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: "Error: " + error.message
        };
    }
};
