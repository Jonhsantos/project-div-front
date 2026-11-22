import arrowBack from '@material-symbols/svg-400/outlined/arrow_back.svg'
import arrowForward from '@material-symbols/svg-400/outlined/arrow_forward.svg'
import menu from '@material-symbols/svg-400/outlined/menu.svg'
import trips from '@material-symbols/svg-400/outlined/work.svg'
import history from '@material-symbols/svg-400/outlined/history.svg'
import logout from '@material-symbols/svg-400/outlined/logout.svg'
import copy from '@material-symbols/svg-400/outlined/content_copy.svg'
import warning from '@material-symbols/svg-400/outlined/warning.svg'

const icons = { arrowBack, arrowForward, menu, trips, history, logout, copy, warning }

export default function Icon({ name }) {
  return <img className="material-icon" src={icons[name]} alt="" aria-hidden="true" />
}
