import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import Head from 'next/head'
import Menu from 'src/components/menu'
import {trpc} from 'src/utils/trpc'
import PredefinedWorkout from 'src/components/predefined-workout'
interface CreateWorkout {
	userId: string
	name: string
	description: string
}

const CreateWorkout = () => {
	const {data: session} = useSession()
	const router = useRouter()

	const userId = session?.user?.id as string

	const createWorkout = trpc.useMutation('workout.createWorkout')

	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<CreateWorkout>()

	const onSubmit: SubmitHandler<CreateWorkout> = async (data) => {
		try {
			data.userId = userId
			const workout = await createWorkout.mutateAsync(data)
			if (workout) {
				router.push(`/workout/${workout.id}`)
			}
		} catch {}
	}

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return (
		<>
			<Head>
				<title>Create Workout</title>
			</Head>
			<Menu>
				<div className='container mx-auto flex flex-col gap-4 p-4'>
					<h1 className='text-center text-3xl font-bold'>Create Workout</h1>
					<PredefinedWorkout userId={userId} />
					<h2 className='text-center text-xl font-bold'>
						Create your custom workout
					</h2>
					<form
						className='rounded bg-blue-300 p-4 dark:bg-slate-900'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='mb-4'>
							<label
								className='mb-2 block text-4xl font-bold dark:text-white'
								htmlFor='name'
							>
								Name
							</label>
							<input
								className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight shadow focus:outline-none'
								id='name'
								type='text'
								placeholder='Name'
								{...register('name', {required: true})}
							/>
							{errors.name && <span>This field is required</span>}
						</div>
						<div className='mb-4'>
							<label
								className='mb-2 block text-4xl font-bold dark:text-white'
								htmlFor='description'
							>
								Description
							</label>
							<input
								className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight shadow focus:outline-none'
								id='description'
								type='text'
								placeholder='Description'
								{...register('description', {required: true})}
							/>
							{errors.description && <span>This field is required</span>}
						</div>

						<div className='flex justify-center'>
							<button className='button' type='submit'>
								Create
							</button>
						</div>
					</form>
				</div>
			</Menu>
		</>
	)
}

export default CreateWorkout
