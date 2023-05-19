import "./Home.css"

import { FC } from "react"

import logo from "../../assets/images/vite.svg"
import { Show, useGetAssetsByDayQuery } from "../../services/baseApi"
import Counter from "../counter/Counter"

interface ListShowProps {
  show: Show
}

const ListShow = ({ show }: ListShowProps) => (
  <div>
    {show.band}
    <br />
    <br />
    {show.stage}
    <br />
    <br />
    {show.start}
    <br />
    <br />
  </div>
)

const Home: FC = () => {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetAssetsByDayQuery("1")
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')
  return (
    <div className="App">
      <header>
        <h1>Welcome to My Landing Page</h1>
      </header>
      <main>
        <section id="about">
          <h2>About</h2>
          <p>Here's some information about my product or service.</p>
        </section>
        <section id="contact">
          <h2>Contact</h2>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 My Company Name</p>
      </footer>
    </div>
  )
}
export default Home
