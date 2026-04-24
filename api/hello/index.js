module.exports = async function (context, req) {
    try {
        const sql = require('mssql');

        const connectionString = process.env.SQL_CONNECTION_STRING;

        if (!connectionString) {
            throw new Error("No existe la variable SQL_CONNECTION_STRING en Azure.");
        }

        await sql.connect(connectionString);

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
            headers: {
                "Content-Type": "application/json"
            },
            body: result.recordset
        };

    } catch (error) {
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "text/plain"
            },
            body: "ERROR API: " + error.message
        };
    }
};
