from marshmallow import Schema, fields, validate

class PeriodSchema(Schema):
    desde = fields.Raw(allow_none=True)
    hasta = fields.Raw(allow_none=True)
    actual = fields.Bool(load_default=False)

class CountrySchema(Schema):
    id = fields.Str(dump_only=True)
    code = fields.Str(required=True, validate=validate.Length(equal=2))
    nombre = fields.Str(required=True)

class CitySchema(Schema):
    id = fields.Str(dump_only=True)
    nombre = fields.Str(required=True)
    country_id = fields.Str(required=True)

class GenderSchema(Schema):
    id = fields.Str(dump_only=True)
    nombre = fields.Str(required=True)

class ProfessionSchema(Schema):
    id = fields.Str(dump_only=True)
    nombre = fields.Str(required=True)
    categoria = fields.Str(allow_none=True)
    descripcion = fields.Str(allow_none=True)

class LanguageSchema(Schema):
    id = fields.Str(dump_only=True)
    nombre = fields.Str(required=True)
    nivel = fields.Str(
        allow_none=True,
        validate=validate.OneOf(["A1", "A2", "B1", "B2", "C1", "C2", "nativo"])
    )

class HobbySchema(Schema):
    nombre = fields.Str(required=True)
    categoria = fields.Str(allow_none=True)
    descripcion = fields.Str(allow_none=True)
    active = fields.Bool(load_default=True)

class TattooSchema(Schema):
    tiene_tatuajes = fields.Bool(required=True)
    descripcion = fields.Str(allow_none=True)
    estilo = fields.Str(allow_none=True)
    significado = fields.Str(allow_none=True)
    cantidad = fields.Int(allow_none=True)

class WorkExperienceSchema(Schema):
    empresa = fields.Str(required=True)
    cargo = fields.Str(required=True)
    industria = fields.Str(allow_none=True)
    modalidad = fields.Str(
        allow_none=True,
        validate=validate.OneOf(["remoto", "presencial", "hibrido", "freelance"])
    )
    desde = fields.Raw(required=True)
    hasta = fields.Raw(allow_none=True)
    actual = fields.Bool(load_default=False)
    descripcion = fields.Str(allow_none=True)

class EducationSchema(Schema):
    institucion = fields.Str(required=True)
    titulo = fields.Str(required=True)
    area = fields.Str(allow_none=True)
    desde = fields.Raw(allow_none=True)
    hasta = fields.Raw(allow_none=True)
    actual = fields.Bool(load_default=False)

class GoalSchema(Schema):
    tipo = fields.Str(required=True, validate=validate.OneOf([
        "profesional", "personal", "deportivo", "financiero", "academico"
    ]))
    descripcion = fields.Str(required=True)
    desde = fields.Raw(allow_none=True)
    hasta = fields.Raw(allow_none=True)
    estado = fields.Str(
        allow_none=True,
        validate=validate.OneOf(["pendiente", "en_progreso", "cumplido", "pausado"])
    )

class RelationshipSchema(Schema):
    id = fields.Str(dump_only=True)
    p1_id = fields.Str(required=True)
    p2_id = fields.Str(required=True)
    tipo_relacion = fields.Str(required=True, validate=validate.OneOf([
        "amigo", "familiar", "compañero_trabajo", "pareja", "conocido", "socio"
    ]))
    descripcion = fields.Str(allow_none=True)
    nivel_confianza = fields.Int(validate=validate.Range(min=1, max=5))
    desde = fields.Raw(allow_none=True)
    hasta = fields.Raw(allow_none=True)
    estado = fields.Str(
        allow_none=True,
        validate=validate.OneOf(["activa", "finalizada", "distante", "conflicto"])
    )
    created_at = fields.Raw(dump_only=True)
    updated_at = fields.Raw(dump_only=True)

class PersonSchema(Schema):
    id = fields.Str(dump_only=True)

    # Identidad base
    nombre = fields.Str(required=True, validate=validate.Length(min=1))
    apellido = fields.Str(required=True, validate=validate.Length(min=1))
    nombre_completo = fields.Str(dump_only=True)
    fecha_nacimiento = fields.Raw(allow_none=True)
    edad = fields.Int(dump_only=True)

    # Identidad simbólica
    signo_zodiacal = fields.Str(allow_none=True)
    eneagrama = fields.Str(allow_none=True)
    genero = fields.Str(allow_none=True)

    # Ubicación
    ciudad_nacimiento = fields.Str(allow_none=True)
    pais_nacimiento = fields.Str(allow_none=True)
    ciudad_residencia = fields.Str(allow_none=True)
    pais_residencia = fields.Str(allow_none=True)

    # Contacto
    email = fields.Email(required=True)
    telefono = fields.Str(required=True)

    # Perfil profesional
    profesion = fields.Str(allow_none=True)
    rol_actual = fields.Str(allow_none=True)
    especializacion = fields.List(fields.Str(), allow_none=True)
    modelo_trabajo = fields.Str(
        allow_none=True,
        validate=validate.OneOf(["remoto", "presencial", "hibrido", "freelance", "in_house", "emprendedor"])
    )
    soft_skills = fields.List(fields.Str(), allow_none=True)
    vision_largo_plazo = fields.Str(allow_none=True)

    # Perfil deportivo
    disciplina_principal = fields.Str(allow_none=True)
    mentalidad_competitiva = fields.Str(
        allow_none=True,
        validate=validate.OneOf(["competitivo", "cooperativo", "mixto"])
    )
    hitos_fisicos = fields.List(fields.Str(), allow_none=True)
    relacion_salud = fields.Str(allow_none=True)

    # Perfil psicológico
    descripcion = fields.Str(allow_none=True)
    hobbies = fields.List(fields.Nested(HobbySchema), allow_none=True)
    colores_favoritos = fields.List(fields.Str(), allow_none=True)
    valores_fundamentales = fields.List(fields.Str(), allow_none=True)
    disparadores_estres = fields.List(fields.Str(), allow_none=True)
    motivadores = fields.List(fields.Str(), allow_none=True)

    # Otros
    idiomas = fields.List(fields.Nested(LanguageSchema), allow_none=True)
    tatuajes = fields.Nested(TattooSchema, allow_none=True)
    historial_trabajos = fields.List(fields.Nested(WorkExperienceSchema), allow_none=True)
    educacion = fields.List(fields.Nested(EducationSchema), allow_none=True)
    metas = fields.List(fields.Nested(GoalSchema), allow_none=True)

    created_at = fields.Raw(dump_only=True)
    updated_at = fields.Raw(dump_only=True)
