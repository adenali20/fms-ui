{{- define "fms-ui.name" -}}
fms-ui
{{- end }}

{{- define "fms-ui.fullname" -}}
{{ include "fms-ui.name" . }}-{{ .Release.Name }}
{{- end }}
