import React, { Component, Fragment } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Button,
  LinearProgress
} from "material-ui";

import {
  Done as DoneIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from "material-ui-icons";
import { Formik } from "formik";
import moment from "moment";

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

const DateInput = ({
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
    type="date"
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
    defaultValue={value}
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
  constructor(props) {
    super(props);
    this.state = {};
    this.renderField = this.renderField.bind(this);
  }

  renderField(
    { values, errors, touched, handleChange, handleBlur },
    { type, config }
  ) {
    const { loading } = this.props;
    let value = values[config.name];
    if (config.name.includes(".")) {
      const subsections = config.name.split(".");
      value = subsections.reduce((lastValue, currentValue, index) => {
        if (!lastValue) return "";
        return lastValue[subsections[index]];
      }, values);
    }

    switch (type) {
      case "input":
        return (
          <InputField
            name={config.name}
            value={value}
            error={errors[config.name]}
            touched={touched[config.name]}
            label={config.label}
            onBlur={handleBlur}
            onChange={
              config.handleChange
                ? e => config.handleChange(e, handleChange, values)
                : handleChange
            }
            disabled={
              loading ||
              (typeof config.disabled == "function"
                ? config.disabled(values)
                : config.disabled)
            }
          />
        );
      case "date-input":
        return (
          <DateInput
            name={config.name}
            value={value}
            error={errors[config.name]}
            touched={touched[config.name]}
            label={config.label}
            onBlur={handleBlur}
            onChange={
              config.handleChange
                ? e => config.handleChange(e, handleChange, values)
                : handleChange
            }
            disabled={
              loading ||
              (typeof config.disabled == "function"
                ? config.disabled(values)
                : config.disabled)
            }
          />
        );
      case "select":
        return (
          <SelectField
            name={config.name}
            value={value}
            error={errors[config.name]}
            touched={touched[config.name]}
            label={config.label}
            onBlur={handleBlur}
            onChange={
              config.handleChange
                ? e => config.handleChange(e, handleChange, values)
                : handleChange
            }
            disabled={
              loading ||
              (typeof config.disabled == "function"
                ? config.disabled(values)
                : config.disabled)
            }
            options={config.options}
            optionsConfig={config.optionsConfig}
          />
        );
    }
  }

  render() {
    const {
      title,
      fields,
      initialValues,
      onSubmit,
      onBack,
      loading
    } = this.props;
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={onSubmit}
        validate={values => {
          const errors = {};
          fields.forEach(({ validation, config }) => {
            let value = values[config.name];
            if (config.name.includes(".")) {
              const subsections = config.name.split(".");
              value = subsections.reduce((lastValue, currentValue, index) => {
                if (!lastValue) return "";
                return lastValue[subsections[index]];
              }, values);
            }
            if (validation && !validation(value)) {
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
                      <Button onClick={onBack} disabled={!onBack || loading}>
                        {formControl.dirty ? (
                          <Fragment>
                            <CloseIcon />
                          </Fragment>
                        ) : (
                          <Fragment>
                            <ArrowBackIcon />
                          </Fragment>
                        )}
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
                        disabled={!formControl.isValid || loading}
                      >
                        <DoneIcon />
                        <Typography variant="button">Salvar</Typography>
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Paper style={{ padding: 16 }}>
                  {loading && <LinearProgress />}
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
