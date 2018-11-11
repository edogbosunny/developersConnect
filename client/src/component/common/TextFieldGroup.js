import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className='form-group'>
      <input
        type='password'
        className={classnames('form-control form-control-lg', {
          'is-invalid': errors.password
        })}
        placeholder='Password'
        name='password'
        value={this.state.password}
        onChange={this.onChange}
      />
      {errors.password &&
        <div className='invalid-feedback'>{errors.password}</div>}
    </div>
  )
}

export default TextFieldGroup
