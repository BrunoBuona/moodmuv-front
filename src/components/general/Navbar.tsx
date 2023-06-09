/* This example requires Tailwind CSS v2.0+ */
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menuu from "@mui/material/Menu";
import { useState, useEffect, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/logoDegrade.png";
import './Navbar.css'
import Moods from '../../assets/moods.png'
//UTILITIES
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import SpinnerContext from "../../utils/SpinnerContext";
import userActions from "../../redux/actions/userActions";
import teacherActions from "../../redux/actions/teacherActions";
import studentActions from "../../redux/actions/studentActions";
import activityActions from "../../redux/actions/activityActions";
import { RootState } from "../../main";
import axios from "axios";

//css
import "../../styles/mediaqueriesNavbar.css";
import Swal from "sweetalert2";
const navigation = [
  { name: "Explorar", href: "#", current: false },
  { name: "Planes", href: "#", current: false },
  { name: "Iniciar sesión", href: "#", current: false },



];

const link = [
  "/explore",
  "/payments",
  "/signIn",
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
function Navbar(props: any) {
  const key = props?.newUser;

  let { spinner, setSpinner }: any = useContext(SpinnerContext);
  let navigate = useNavigate();

  const [openDrop, setOpenDrop] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  let [fileValue, setFile] = useState(undefined);

  const setearOpenDrop = () => {
    setOpenDrop(!openDrop);
  };
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    async function fetchFile() {
      let file: string | any = await axios({
        method: "get",
        url:
          "http://localhost:4000/api/files/avatarProfile/" +
          props?.currentUser?._id,
      });

      setFile(file.data);
    }
    fetchFile();
  }, [spinner, props.currentUser]);
  
  class PaymentDataSub {
    reason: string;
    auto_recurring: {
      frequency: number;
      frequency_type: string;
      transaction_amount: number;
      //start_date: string;
      //end_date: string;
      free_trial:{
        frequency:number;
        frequency_type:string;
      }
      currency_id: string;
    };
    back_url: string;
    payer_email: string;

    constructor(reason: string, email: string, price: number) {
        (this.reason = reason),
        (this.auto_recurring = {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: price,
            //start_date: "2023-02-06T15:59:52.581Z",
            //end_date: "2023-02-08T15:59:52.581Z",
            free_trial: {
              frequency: 1,
              frequency_type: "months"
            },
            currency_id: "CLP",
        }),
        (this.back_url = "https://www.google.com/"),
        (this.payer_email = email);
    }
  }

  const planHappy = new PaymentDataSub(
    "Plan Happy",
    "moodmuv@gmail.com",
    3500
  );

  const handleClick = async (
     e: any,
  paymentData: any
) => {

      try {
        const url = `http://localhost:4000/api/student/subscription`;
        const res = await axios.post(url, paymentData);
        
        if (res.status && res.status === 200) {
          window.location.assign(res.data.init_point);
        }
      } catch (error: any) {
        console.log(error.response);
      }
      
  };

  return (
    <Disclosure as="nav" className="h-[18vh] relative z-10">
      {({ open }) => (
        <>
          <div className="mx-auto h-24 max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-24 items-center md:justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-between rounded-md p-2 text-[#563D81]  hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center sm:justify-end justify-end h-full">
                {/* logos */}
                <div className="flex justify-between flex-shrink-0 items-center h-full">
                  <Link to={"/home"}>
                    <img
                      className="hidden sm:block h-full w-20 object-contain"
                      src={Logo}
                      alt="Your Company"
                    />
                    
                  </Link>
                </div>
                <div className="hidden md:block sm:ml-6 w-full">
                  <div className="flex justify-end items-center">
                    <Link to={"/explore"}>
                      <p className='navbar-items'>Explorar</p>
                    </Link>
                    {
                      props?.currentUser?.type === "Teacher" ? null
                      :
                    <Link to={"/plans"}>
                      <p className='navbar-items'>Planes</p>
                    </Link>
                    }
                    {/* Esto de acá abajo es el desplegable */}
                    {props.currentUser?._id ? 
                    <Box sx={{ flexGrow: 0 }}>
                      <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, m: 0, width: "auto", mr: 5 }}>
                          <Avatar className='navbar-items menuPic' alt="P" src={fileValue !== undefined ? (`data:image/png;base64,${fileValue}`) : ("")} sx={{ width: 30, height: 30, fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Menuu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        <Link to={'/account'}>
                          <MenuItem onClick={handleCloseUserMenu}>
                            Profile
                          </MenuItem>
                        </Link>
                        {
                          props?.currentUser?.type === "Teacher" ? null :
                        <Link to={'/account/courses'}>
                          <MenuItem onClick={handleCloseUserMenu}>
                            Courses
                          </MenuItem>
                        </Link>
                        }
                        {
                         props?.currentUser?.type == "Teacher" ?  <Link to={'/account/panel'}>
                          <MenuItem onClick={handleCloseUserMenu}>
                            Panel
                          </MenuItem>
                        </Link> : null
                        }
                      

                        <Link to={'/account/settings'}>
                          <MenuItem onClick={handleCloseUserMenu}>
                            Setting
                          </MenuItem>
                        </Link>

                        {props?.currentUser?.admin && (
                          <Link to={'/account/admin'}>
                            <MenuItem onClick={handleCloseUserMenu}>
                              Admin
                            </MenuItem>
                          </Link>
                        )}


                        <Typography onClick={() => {
                          props.logOut()
                          setearOpenDrop()
                          navigate('/home')
                          window.scrollTo(0, 0);
                          props.resetStoreTeacher()
                          props.resetStoreStudent()
                          props.resetStoreActivities()
                        }}>

                          <MenuItem onClick={handleCloseUserMenu}>
                            Logout
                          </MenuItem>

                        </Typography>
                      </Menuu>
                    </Box>
                    : <Link to='/signin'>Iniciar Sesion</Link>}
                   { props?.currentUser?.type == "Teacher" ? null : 
                      props?.currentUser?.newUser == false ?
                      <p className='navbar-items'><img className="moods-picture" src={Moods} alt="moods" /> &nbsp; {props?.currentUser?.credits} Moods</p>
                    : 
                      <button onClick={e=> Swal.fire({
                        title: '<strong>Prueba Gratuita (30 Dias)</u></strong>',
                        icon: 'info',
                        html:
                          '¿Quieres activar tu <b>prueba gratuita</b>?' + '<br/>' +
                          '<a class="information-ft" href="#">Click aquí para más información sobre la prueba.</a> ',
                        showCancelButton: true,
                        focusConfirm: false,
                        confirmButtonText:
                          '¡Activar!',
                        confirmButtonAriaLabel: '¡Activar!',
                        cancelButtonText:
                          'Aún no',
                        cancelButtonAriaLabel: 'Thumbs down',
                        didOpen: () => {
                          let intervalId = setInterval(() => {
                            const confirmButton = Swal.getConfirmButton();
                            if (confirmButton) {
                              confirmButton.addEventListener('click', (e) => handleClick(e, planHappy));
                              clearInterval(intervalId);
                            }
                          }, 100);
                        }
                      })
                      } className='freeTrial'>FREE TRIAL</button>
                    } 
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ESTO DE ACA ABAJO ES EL NAVBAR EN RESPONSIVE */}

          <Disclosure.Panel className="">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item, index) => (
                <div key={index}>
                  {item.name == "Iniciar sesión" ? (
                    props.currentUser?._id ? (
                      <>
                        <Disclosure.Button
                          as="a"
                          href={"/account"}
                          className={classNames(
                            item.current
                              ? "bg-gradient-to-t from-[#563D81] to-[#563D81] text-white"
                              : "text-[#2C2C2C] hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          Cuenta
                        </Disclosure.Button>
                        <Disclosure.Button
                          as="a"
                          href={"/account/panel"}
                          className={classNames(
                            item.current
                              ? "bg-gradient-to-t from-[#563D81] to-[#563D81] text-white"
                              : "text-[#2C2C2C] hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          Panel
                        </Disclosure.Button>
                        <Disclosure.Button
                          as="a"
                          onClick={() => {
                            props.logOut();
                            setearOpenDrop();
                            navigate("/home");
                            window.scrollTo(0, 0);
                            props.resetStoreTeacher();
                            props.resetStoreStudent();
                            props.resetStoreActivities();
                          }}
                          className={classNames(
                            item.current
                              ? "bg-gradient-to-t from-[#563D81] to-[#563D81] text-white cursor-pointer"
                              : "text-[#2C2C2C] hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          Logout
                        </Disclosure.Button>
                      </>
                    ) : (
                      <Disclosure.Button
                        as="a"
                        href={link[navigation.indexOf(item)]}
                        className={classNames(
                          item.current
                            ? "bg-gradient-to-t from-[#563D81] to-[#563D81] text-white"
                            : "text-[#2C2C2C] hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    )
                  ) : (
                    <Disclosure.Button
                      as="a"
                      href={link[navigation.indexOf(item)]}
                      className={classNames(
                        item.current
                          ? "bg-gradient-to-t from-[#563D81] to-[#563D81] text-white"
                          : "text-[#2C2C2C] hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  )}
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const mapDispatch = {
  logOut: userActions.logOut,
  resetStoreTeacher: teacherActions.resetStore,
  resetStoreStudent: studentActions.resetStore,
  resetStoreActivities: activityActions.resetStore,
  fetchActivity: activityActions.fetchActivity,
};

const mapState = (state: RootState) => {
  return {
    currentUser: state.userReducer.currentUser,
    activity: state.activityReducer.activity,
  };
};

const connector = connect(mapState, mapDispatch);

export default connector(Navbar);
