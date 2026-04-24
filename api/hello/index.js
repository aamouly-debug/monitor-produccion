await sql.connect(connectionString);

const result = await sql.query(`
    SELECT *
    FROM dbo.vw_ControlProduccion_Final
    WHERE FechaCC = '2026-04-21'
      AND Turno = 'Turno 1'
    ORDER BY
        ORDENGRUPO,
        secuencia,
        NroOrden
`);
