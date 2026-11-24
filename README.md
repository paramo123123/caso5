# Caso 5 — Puntada y la máquina compartida

Aplicación local para la Parte 2 de Estudio y Diseño del Trabajo. Abre `index.html` en un navegador moderno; no requiere servidor ni conexión.

## Modelo implementado
Cada pedido sigue preparación (P) → costura (S) → acabado (F), con cola entre etapas y sin dividir pedidos. Los recursos de etapa son únicos. La persona asignada a S y la máquina están ocupadas durante toda la costura. El tiempo estándar de cada etapa se modela como bloque completo de ocupación.

- A: P = 3 min, S = 4 min, F = 2 min por pedido.
- B: P = 1.5 min, S = 4 min, F = 2 min.
- C: P = 3 min, S = 3 min, F = 2 min; calibración de S y máquina durante los primeros 9 min.
- La base A proviene de promedios medidos: P (50 + 100) s × 1.20 = 180 s; S 200 s × 1.20 = 240 s; F (60 + 40) s × 1.20 = 120 s. El 15 min de descanso ya está excluido de los 60 min netos.
- Habilidades: Elena P/S; Hugo P/F; Inés S/F. Las únicas asignaciones fijas válidas, usando cada persona una vez, son Elena-P, Inés-S, Hugo-F; o Hugo-P, Elena-S, Inés-F.
- Costo: A 0, B 90, C 450 u. m. Contribución por accesorio adicional respecto de A: 7 u. m. durante 30 sesiones.

## Funciones
- Simula cronograma por pedido, inicio y fin de cada etapa, terminaciones puntuales y faltantes.
- Valida pedidos enteros no negativos, ventana positiva, habilidades, duplicaciones y disponibilidad de cada persona.
- Rechaza asignaciones inválidas; no asume que una persona puede estar en dos puestos.
- Exporta cronograma CSV.
- Muestra proporciones del muestreo sintético de 120 instantes por persona.
- Presenta evaluación geométrica sentada, momento estático simplificado y secuencia bimanual solicitada.
- Compara inversión y contribución incremental para la cantidad de pedidos y ventana configurados.

## Pruebas de referencia del enunciado
1. A; 1 pedido; H = 9: P 0–3, S 3–7, F 7–9; 1 puntual.
2. A; 2 pedidos; H = 12: pedido 1 termina en 9; pedido 2 termina en 13; 1 puntual (el segundo excede H).
3. C; 2 pedidos; H = 17: calibración S 0–9; P1 0–3, P2 3–6; S1 9–12, S2 12–15; F1 12–14, F2 15–17; 2 puntuales.
4. Asignación inválida (Inés en P o Hugo en S) debe ser rechazada por habilidad; duplicar una persona también debe rechazarse.

## Resultados de referencia derivados del calendario
Para 16 pedidos y H = 60, asignación Elena-P / Inés-S / Hugo-F:
- A: primer terminado 9 min; pedido 16 termina 69 min; 13 entregas puntuales; faltan 3.
- B: primer terminado 7.5 min; pedido 16 termina 67.5 min; 14 entregas puntuales; faltan 2.
- C: calibración inicial 9 min; primer terminado 14 min; pedido 16 termina 59 min; 16 puntuales; faltan 0.
- Bajo la condición de entregar los 16, C es la única alternativa factible. Contra A produce 3 adicionales por sesión: 3 × 7 × 30 = 630 u. m.; menos 450 = +180 u. m. B agrega 1: 210 − 90 = +120 u. m.
- Sensibilidad: 14 pedidos y H = 55: A termina puntualmente 12; B 12; C 14. C es la única que cumple los 14; contribución incremental vs A = 2 × 7 × 30 = 420; saldo tras inversión C = −30 u. m. La condición de plazo obliga C aunque el saldo incremental sea negativo.

## Muestreo y ergonomía
Los porcentajes se calculan por persona sobre 120 observaciones: Elena trabajo 56.67 %, espera material 23.33 %, consulta 20 %; Inés 78.33 %, 6.67 %, 15 %; Hugo 39.17 %, 40.83 %, 20 %. Investigar esperas y clasificar sus causas en un nuevo estudio; no reducir automáticamente estándares.

Con asiento de 45 cm, rangos de plano de manipulación desde piso: Elena 65–68 cm; Hugo 69–72 cm; Inés 67–70 cm. Ajustes sugeridos: 66.5, 70.5 y 68.5 cm. Una mesa fija de 70 cm queda fuera del rango didáctico de Elena. Ubicación común frecuente dentro de 36 cm (menor alcance cómodo de las tres personas). Para 0.4 kg: momento a 0.35 m = 1.3734 N·m; a 0.20 m = 0.7848 N·m; cambio = 0.5886 N·m (42.86 %). Modelo estático simplificado, no clínico ni normativo.

## Límites y revisión
El caso es ficticio y sintético. La aplicación no modela defectos, variabilidad, cambios dinámicos de puesto, lotes ni tareas reales con herramientas. El muestreo no autoriza eliminar puestos ni descontar tiempos estándar. La geometría no representa percentiles poblacionales. El momento no es evaluación clínica ni certificación. El equipo debe conservar su predicción previa, cálculos manuales, diagramas, y contrastar con el anexo patrón del docente cuando sea liberado. Revisar unidades y resultados antes de entregar.

## Uso de IA
Consulta `documentacion/registro_ia.md`. La herramienta no sustituye el análisis manual, la decisión ni la revisión del equipo.