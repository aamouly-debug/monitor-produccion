const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const connectionString = process.env.SQL_CONNECTION_STRING;

        const fecha = req.query.fecha;
        const turno = req.query.turno;
        const grupo = req.query.grupo || "Todos";

        if (!fecha || !turno) {
            context.res = {
                status: 400,
                body: "Faltan parámetros: fecha y turno"
            };
            return;
        }

        await sql.connect(connectionString);

        const request = new sql.Request();

        request.input("fecha", sql.Date, fecha);
        request.input("turno", sql.VarChar, turno);
        request.input("grupo", sql.VarChar, grupo);

        const result = await request.query(`
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
            WHERE FechaCC = @fecha
              AND Turno = @turno
              AND (@grupo = 'Todos' OR Grupo = @grupo)
            ORDER BY
                ORDENGRUPO,
                secuencia,
                NroOrden
        `);

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: result.recordset
        };

    } catch (error) {
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            },
            body: "ERROR API DATOS: " + error.message
        };
    } finally {
        try {
            await sql.close();
        } catch (e) {}
    }
};
