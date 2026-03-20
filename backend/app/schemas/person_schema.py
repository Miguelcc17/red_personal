from marshmallow import Schema, fields, validate

class PersonSchema(Schema):
    id = fields.Str(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(min=1))
    apellido = fields.Str(required=True, validate=validate.Length(min=1))
    edad = fields.Int(required=True, validate=validate.Range(min=0))
    genero = fields.Str(allow_none=True)
    ciudad = fields.Str(required=True)
    pais = fields.Str(required=True)
    profesion = fields.Str(required=True)
    email = fields.Email(required=True)
    telefono = fields.Str(required=True)
    descripcion = fields.Str()
    intereses = fields.List(fields.Str())

    # Nuevos campos para análisis detallado
    hobbies = fields.List(fields.Dict(keys=fields.Str(), values=fields.Raw()), allow_none=True)
    colores_favoritos = fields.List(fields.Str(), allow_none=True)
    signo_zodiacal = fields.Str(allow_none=True)
    tiene_tatuajes = fields.Bool(allow_none=True)
    tatuajes_descripcion = fields.Str(allow_none=True)
    historial_trabajos = fields.List(fields.Dict(keys=fields.Str(), values=fields.Raw()), allow_none=True)

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class RelationshipSchema(Schema):
    id = fields.Str(dump_only=True)
    p1_id = fields.Str(required=True)
    p2_id = fields.Str(required=True)
    tipo_relacion = fields.Str(required=True, validate=validate.OneOf([
        "amigo", "familiar", "compañero_trabajo", "pareja", "conocido", "socio"
    ]))
    descripcion = fields.Str()
    nivel_confianza = fields.Int(validate=validate.Range(min=1, max=5))
    fecha_inicio = fields.Date()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
