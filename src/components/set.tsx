import {useForm, useFieldArray, SubmitHandler} from 'react-hook-form'

import {trpc} from 'src/utils/trpc'

interface SetProps {
	exerciseId: string
	workoutId: string
	showForm: boolean
}

interface SetInputs {
	exerciseId: string
	workoutId: string
	sets: {
		weight: number
		reps: number
	}[]
}

const Set = ({exerciseId, workoutId, showForm}: SetProps) => {
	const {
		register,
		control,
		handleSubmit,
		formState: {errors},
	} = useForm<SetInputs>({
		defaultValues: {
			sets: [{weight: 0, reps: 0}],
		},
		mode: 'onBlur',
	})
	const utils = trpc.useContext()
	const {fields, append, remove} = useFieldArray({
		name: 'sets',
		control,
	})

	const createSets = trpc.set.createSets.useMutation({
		async onSuccess() {
			await utils.set.getSetsByExerciseId.invalidate()
		},
	})

	const {data, isError, isLoading} = trpc.set.getSetsByExerciseId.useQuery({
		exerciseId,
	})

	const onSubmit: SubmitHandler<SetInputs> = async (data) => {
		try {
			data.exerciseId = exerciseId
			data.workoutId = workoutId
			await createSets.mutateAsync(data)
		} catch {}
	}
	return (
		<div className='text-center'>
			{isLoading && <div>Loading...</div>}
			{isError && <div>Error</div>}
			<div className='flex justify-around font-semibold'>
				<div>Weight</div>
				<div>Reps</div>
			</div>
			{data &&
				data.map((set) => (
					<div key={set.id} className='flex justify-around'>
						<p>{set.weight}</p>
						<p> {set.reps}</p>
					</div>
				))}
			{showForm && (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-4 rounded p-2'
				>
					{fields.map((field, index) => {
						return (
							<div
								key={field.id}
								className='grid grid-cols-2 items-center gap-2 rounded bg-slate-700 p-2'
							>
								<label htmlFor='weight' className='text-center text-white'>
									Weight
								</label>
								<input
									id='weight'
									type='number'
									min={1}
									placeholder='0 lbs'
									{...register(`sets.${index}.weight` as const, {
										required: true,
										valueAsNumber: true,
									})}
									className='m-1 rounded border p-1'
								/>
								<label htmlFor='reps' className='text-center text-white'>
									Reps
								</label>
								<input
									id='reps'
									type='number'
									min={1}
									placeholder='0 reps'
									{...register(`sets.${index}.reps` as const, {
										required: true,
										valueAsNumber: true,
									})}
									className='m-1 rounded border p-1'
								/>
								<div className='col-span-2 flex justify-center'>
									<button
										onClick={() => remove(index)}
										className='button hover:bg-blue-400'
									>
										Remove Set
									</button>
								</div>
							</div>
						)
					})}

					<div className='dark:blue-900 flex items-center justify-center gap-4 rounded py-2'>
						<button
							className='button hover:bg-blue-400'
							onClick={() =>
								append({
									weight: 0,
									reps: 0,
								})
							}
						>
							Add one more set
						</button>
					</div>
					<div className='flex justify-center'>
						<button className='button'>Save Sets</button>
					</div>
				</form>
			)}
		</div>
	)
}

export default Set
