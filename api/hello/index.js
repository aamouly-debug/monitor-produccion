const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const connectionString = process.env.SQL_CONNECTION_STRING;

        if (!connectionString) {
            context.res = {
                status: 500,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "ERROR API: No existe SQL_CONNECTION_STRING en Azure."
            };
            return;
        }

        await sql.connect(connectionString);

        const result = await sql.query(`
            SELECT
                FechaCC,
                Turno,
                Grupo,
                Parametro,
                Hora_Registro,
                NroOrden,
                Valor,
                ValorNum,
                Ref_Min,
                Ref_Max,
                Unidad,
                ORDENGRUPO,
                secuencia
            FROM dbo.vw_ControlProduccion_Final
            WHERE CONVERT(date, FechaCC) = '2026-04-21'
              AND Turno = 'Turno 1'
            ORDER BY
                ORDENGRUPO,
                secuencia,
                NroOrden
        `);

        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: result.recordset
        };

    } catch (error) {
        context.res = {
            status: 500,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "ERROR API: " + error.message
        };
    } finally {
        try {
            await sql.close();
        } catch (e) {
        }
    }
};
