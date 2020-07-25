import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Modal, Accordion } from "react-bootstrap";
import SplitText from "react-pose-text";
import MaterialTable from "material-table";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import copy from "copy-to-clipboard";
import alertify from "alertifyjs";
const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 30,
  },
};
export default class tabletrying extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { title: "Platform Name", field: "name" },
        { title: "Description", field: "description" },
        { title: "Passwords", field: "passwords" },
        {
          title: "Show Password",
          render: (rowData) => (
            <Button
              onClick={this.showPassword.bind(
                this,
                rowData.tableData.id,
                rowData.password
              )}
              className="btn-circle btn-sm btn-info"
            >
              S
            </Button>
          ),
        },
        {
          title: "Copy Password",
          render: (rowData) => (
            <Button
              onClick={this.copyToClipboard.bind(this, rowData.password)}
              className="btn-circle btn-sm btn-info"
            >
              C
            </Button>
          ),
        },
      ],
      data: [
        {
          name: "",
          description: "",
          password: "",
          passwords: "",
        },
      ],
      title: localStorage.getItem("willSendName") + "'s password list",
      loading: false,
      userId: localStorage.getItem("willSendId"),
      hide: false,
      show: false,
      password: "",
      confirmPassword: "",
      passwordError: "",
      isEverythingOk: false,
    };
  }
  handleModal() {
    console.log("SELLLAM");
    this.setState({ name: "" });
    this.setState({ description: "" });
    this.setState({ password: "" });
    this.setState({ passwordError: "" });
    this.setState({ show: !this.state.show });
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    var arr = [];
    this.setState({ userId: localStorage.getItem("willSendId") });
    const { userId } = this.state;
    const response = await axios.get(
      "https://localhost:44332/PasswalletItems/GetItem/" + userId
    );
    console.log(response);

    for (let index = response.data.length - 1; index >= 0; index--) {
      let obj = {};
      obj.name = response.data[index].name;
      obj.description = response.data[index].description;
      obj.password = response.data[index].password;
      obj.passwords = "●●●●●●";
      arr.push(obj);
    }
    this.setState({ data: arr });
    this.setState({ loading: false });
  };

  getItemsAgain = async () => {
    this.setState({ loading: true });
    var arr = [];
    this.setState({ userId: localStorage.getItem("willSendId") });
    const { userId } = this.state;
    const response = await axios.get(
      "https://localhost:44332/PasswalletItems/GetItem/" + userId
    );
    console.log(response);

    for (let index = response.data.length - 1; index >= 0; index--) {
      let obj = {};
      obj.name = response.data[index].name;
      obj.description = response.data[index].description;
      obj.password = response.data[index].password;
      obj.passwords = "●●●●●●";
      arr.push(obj);
    }
    this.setState({ data: arr });
    this.setState({ loading: false });
  };
  copyToClipboard = (password, e) => {
    copy(password);
    console.log(password);
    alertify.set("notifier", "position", "right-bottom");
    alertify.success("✓ Copied to clipboard!");
  };
  goToTheHomePage = () => {
    localStorage.removeItem("willSendId");
    localStorage.removeItem("willSendName");
    debugger;
    this.props.history.push("/");
  };
  showPassword = (id, password, e) => {
    console.log(this.state.hide);
    if (this.state.data[id].passwords === "●●●●●●") {
      let data = [...this.state.data];
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...data[id] };
      // 3. Replace the property you're intested in
      item.passwords = password;
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      data[id] = item;
      // 5. Set the state to our new copy
      this.setState({ data });
    } else {
      let data = [...this.state.data];
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...data[id] };
      // 3. Replace the property you're intested in
      item.passwords = "●●●●●●";
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      data[id] = item;
      this.setState({ data });
    }
    this.setState({ hide: !this.state.hide });
  };
  validate = () => {
    let passwordError = "";

    if (this.state.password !== this.state.confirmPassword) {
      passwordError = "Passwords does not match. Please try again.";
    }
    if (passwordError) {
      this.setState({ passwordError });
    } else {
      this.setState({ passwordError: "" });
    }
    if (passwordError === "") {
      this.setState({ isEverythingOk: true });
    }

    console.log(passwordError);
  };

  submitHandler = async (e) => {
    let isValid = this.validate();
    this.setState({ loading: true });

    e.preventDefault();
    this.setState({ userId: localStorage.getItem("willSendId") });
    const { userId, name, description, password } = this.state;
    const newUser = {
      userId,
      name,
      description,
      password,
    };
    if (this.state.isEverythingOk === false) {
      alertify.set("notifier", "position", "bottom-center");
      alertify.error("First fix errors!");
    } else if (
      this.state.password === "" &&
      this.state.confirmPassword === ""
    ) {
      this.setState({ passwordError: "Password fields can not be empty!" });
    } else {
      this.handleModal();
      try {
        const response = await axios.post(
          "https://localhost:44332/PasswalletItems/AddItem/",
          newUser
        );
        e.preventDefault();
        alertify.set("notifier", "position", "top-center");
        alertify.notify("Password Added Successfully!", "custom");
        this.getItemsAgain();
        this.setState({ passwordError: "" });
      } catch (error) {
        alert("Error");
      }
    }
    this.setState({ loading: false });
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    let u_name = localStorage.getItem("willSendName");
    const { name, description, password, confirmPassword } = this.state;
    return (
      <div>
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          fixed="top"
        >
          <Navbar.Brand href="#home">PassWallet</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="setNavButtons">
              <Nav className="mr-auto">
                <Button
                  href="#modal"
                  className="btn-success"
                  onClick={() => this.handleModal()}
                >
                  Add Password
                </Button>
                <Button
                  eventKey={2}
                  href="#logout"
                  className="totheright btn-danger"
                  onClick={this.goToTheHomePage}
                >
                  Log Out
                </Button>
              </Nav>
            </div>
          </Navbar.Collapse>
        </Navbar>
        <h1 color="#ff0000">Welcome, {localStorage.getItem("willSendName")}</h1>
        <div className="container"></div>
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text="Processing..."
          styles={{
            overlay: (base) => ({
              ...base,
              background: "rgba(40, 116, 166, 0.4)",
            }),
          }}
        >
          <Modal show={this.state.show}>
            <Modal.Header>
              <Button
                className="myNewButton btn-danger"
                onClick={() => this.handleModal()}
              >
                X
              </Button>
            </Modal.Header>

            <Modal.Body>
              <form className="denemelersuruyor">
                <label>
                  <span>Platform Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Type your platforname here..."
                    className="inpdeneme"
                    value={name}
                    onChange={this.changeHandler}
                  />
                </label>
                <label>
                  <span>Description</span>
                  <input
                    type="text"
                    name="description"
                    placeholder="Type description here..."
                    className="inpdeneme"
                    value={description}
                    onChange={this.changeHandler}
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    className="inpdeneme"
                    placeholder="Type your password here..."
                    value={password}
                    onChange={this.changeHandler}
                    onBlur={() => this.validate()}
                  />
                </label>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
                <label>
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="inpdeneme"
                    value={confirmPassword}
                    onChange={this.changeHandler}
                    onBlur={() => this.validate()}
                  />
                </label>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
              </form>
              <Modal.Footer>
                <Button
                  className="submitButton btn-dark"
                  onClick={this.submitHandler}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Modal.Body>
          </Modal>

          <MaterialTable
            title={this.state.title}
            columns={this.state.columns}
            data={this.state.data}
            // editable={{
            //   onRowAdd:  (newData) =>
            //   new Promise((resolve) => {
            //     setTimeout(async () => {
            //       resolve();
            //       console.log(newData)
            //       this.setState({newData:newData})
            //       this.addItem(this)
            //     }, 600);
            //   }),

            // }}
          />
        </LoadingOverlay>
      </div>
    );
  }
}
