const result = await pool.request().query(`
    SELECT *
    FROM dbo.vw_ControlProduccion_Final
    WHERE FechaCC = '2026-04-21'
      AND Turno = 'Turno 1'
    ORDER BY Hora_Registro
`);
