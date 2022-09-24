import {GetServerSidePropsContext} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

import {getServerAuthSession} from 'src/server/common/get-server-auth-session'

import {trpc} from 'src/utils/trpc'

const UserId = () => {
	const {data: session} = useSession()
	const router = useRouter()

	console.log(session)
	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])

	return (
		<div className='container mx-auto p-4'>
			<h1>User</h1>
			<div className=''></div>
		</div>
	)
}

export default UserId
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	return {
		props: {
			session: await getServerAuthSession(ctx),
		},
	}
}