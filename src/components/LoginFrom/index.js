import { Component } from "react";
import Cookies from "react-js-cookie";
import {
  LoginFormContainer,
  LoginButton,
  ShowHideContainer,
  CheckboxInput,
  FormContainer,
  LoginWebsiteLogo,
  ErrorMsg,
  InputContainer,
  InputLabel,
  PasswordInputField,
  UserNameInputField,
} from "./styledComponent";

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    showSubmitError: false,
    errorMsg: "",
    isCheckedPassword: false,
  };

  onSubmitSuccess = (jwtToken) => {
    const { history } = this.props;
    Cookies.set("jwt_token", jwtToken, { expires: 30, path: "/" });
    history.replace("/");
  };

  onShowHidePassword = () => {
    this.setState((prevState) => ({
      isCheckedPassword: !prevState.isCheckedPassword,
    }));
  };

  onSubmitFailure = (errorMsg) => {
    this.setState({ errorMsg, showSubmitError: true });
  };

  onSubmitForm = async (event) => {
    event.preventDeafult();
    const { username, password } = this.state;
    const userDetails = { username, password };
    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token);
    } else {
      this.onSubmitFailure(data.error_msg);
    }
  };

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  renderPasswordField = () => {
    const { password, isCheckedPassword } = this.state;
    return (
      <>
        <InputLabel htmlFor="password">PASSWORD</InputLabel>
        <PasswordInputField
          type={isCheckedPassword ? "text" : "password"}
          id="password"
          placeholder="Password"
          onChange={this.onChangePassword}
          value={password}
        />
        <ShowHideContainer>
          <CheckboxInput
            type="checkbox"
            onChange={this.onShowHidePassword}
            value="Show Password"
            id="show-password"
          />
          <InputLabel htmlFor="show-password">Show password</InputLabel>
        </ShowHideContainer>
      </>
    );
  };

  renderUsernameField = () => {
    const { username } = this.state;
    return (
      <>
        <InputLabel htmlFor="username">USERNAME</InputLabel>
        <UserNameInputField
          type="text"
          onChange={this.onChangeUsername}
          id="username"
          value={username}
          placeholder="Username"
        />
      </>
    );
  };

  render() {
    const { showSubmitError, errorMsg } = this.state;
    return (
      <LoginFormContainer>
        <FormContainer onSubmit={this.onSubmitForm}>
          <LoginWebsiteLogo
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
          />
          <InputContainer>{this.renderUsernameField()}</InputContainer>
          <InputContainer>{this.renderPasswordField()}</InputContainer>
          <LoginButton type="submit">Login</LoginButton>
          {showSubmitError && <ErrorMsg>*{errorMsg}</ErrorMsg>}
        </FormContainer>
      </LoginFormContainer>
    );
  }
}

export default LoginForm;
