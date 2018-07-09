import React, { Component } from "react";
import {
  Grid,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from "material-ui";

import {
  Done as DoneIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from "material-ui-icons";
import { Formik } from "formik";

const InputField = ({
  value,
  name,
  onChange,
  onBlur,
  error,
  touched,
  label,
  disabled
}) => (
  <TextField
    margin="normal"
    name={name}
    value={value}
    error={!!error && touched}
    helperText={touched && error}
    FormHelperTextProps={{ error: true }}
    fullWidth
    label={label}
    onBlur={onBlur}
    onChange={onChange}
    disabled={disabled}
  />
);

class SelectField extends Component {
  render() {
    const {
      label,
      value,
      onChange,
      onBlur,
      name,
      optionsConfig,
      disabled,
      options = []
    } = this.props;
    return (
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Select
          disabled={disabled}
          fullWidth
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          inputProps={{
            name: name,
            id: name
          }}
        >
          <MenuItem value="">
            <em>Selecionar</em>
          </MenuItem>
          {options.map(option => (
            <MenuItem
              key={option[optionsConfig.key]}
              value={option[optionsConfig.value]}
            >
              {option[optionsConfig.description]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

class CRUDForm extends Component {
  renderField(
    { values, errors, touched, handleChange, handleBlur },
    { type, config }
  ) {
    switch (type) {
      case "input":
        return (
          <InputField
            name={config.name}
            value={values[config.name]}
            error={errors[config.name]}
            touched={touched[config.name]}
            label={config.label}
            onBlur={handleBlur}
            onChange={
              config.handleChange
                ? e => config.handleChange(e, handleChange)
                : handleChange
            }
            disabled={config.disabled}
          />
        );
      case "select":
        return (
          <SelectField
            name={config.name}
            value={values[config.name]}
            error={errors[config.name]}
            touched={touched[config.name]}
            label={config.label}
            onBlur={handleBlur}
            onChange={
              config.handleChange
                ? e => config.handleChange(e, handleChange)
                : handleChange
            }
            disabled={config.disabled}
            options={config.options}
            optionsConfig={config.optionsConfig}
          />
        );
    }
  }

  render() {
    const { title, fields, initialValues, onSubmit, onBack } = this.props;
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={onSubmit}
        validate={values => {
          const errors = {};
          fields.forEach(({ validation, config }) => {
            if (validation && !validation(values[config.name])) {
              errors[config.name] = "Inválido";
            }
          });

          return errors;
        }}
        render={formControl => (
          <form onSubmit={formControl.handleSubmit}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item md={10}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%"
                      }}
                    >
                      <Button onClick={onBack} disabled={!onBack}>
                        {formControl.dirty ? <CloseIcon /> : <ArrowBackIcon />}
                      </Button>
                      <Typography variant="title">{title}</Typography>
                    </div>
                  </Grid>

                  <Grid item md={2}>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        type="submit"
                        color="primary"
                        disabled={!formControl.isValid}
                      >
                        <DoneIcon />
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Paper style={{ padding: 16 }}>
                  <Grid container>
                    {fields.map(field => (
                      <Grid item xs={12} md={field.config.width || 12}>
                        {this.renderField(formControl, field)}
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}

export default CRUDForm;
