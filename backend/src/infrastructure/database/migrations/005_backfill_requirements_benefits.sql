-- 005_backfill_requirements_benefits.sql
-- Backfill default requirements and benefits for existing microactivities
-- Uses duration to build a duration label with singular/plural.

UPDATE microactivities SET
  requirements = jsonb_build_array(
    'Un espacio cómodo y tranquilo',
    CASE WHEN duration = 1 THEN '1 minuto de tiempo disponible' ELSE duration || ' minutos de tiempo disponible' END,
    'Actitud positiva y ganas de relajarte'
  ),
  benefits = jsonb_build_array(
    'Reduce el estrés y la ansiedad',
    'Mejora el enfoque y la concentración',
    'Aumenta el bienestar general'
  )
WHERE (requirements IS NULL OR jsonb_array_length(requirements) = 0)
   OR (benefits IS NULL OR jsonb_array_length(benefits) = 0);

-- Optional: verify
-- SELECT id, requirements, benefits FROM microactivities LIMIT 5;