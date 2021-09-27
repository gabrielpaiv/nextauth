import { useContext, useEffect } from 'react'
import { Can } from '../components/Can'
import { AuthContext } from '../context/AuthContext'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }, [])
  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      <Can permissions={['metrics.list']}>
        <h1>Métricas</h1>
      </Can>
    </div>

  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')
  console.log(response.data)
  return {
    props: {}
  }
})