import type { Namespace } from "~/types";

export const usePubSub = (namespace:Namespace)=>{
	const { status, data, error, close, eventSource } = useEventSource(`/api/consumer/${namespace.ref}`)
	
	const messages = ref<string[]>([]);

	watch(()=>data.value, (value)=>{
		if(!value) return;
		messages.value.unshift(value);
	});

	watch(()=>status.value, (value)=>{
		if(value === 'CLOSED') messages.value.unshift('Connection closed');
	})

	onBeforeUnmount(()=>{
		close();
	});

	onMounted(()=>{
		if(!eventSource.value) return;
		eventSource.value.addEventListener('message', (event)=>{
			messages.value.unshift(event.data);
		});
	});

	return {
		messages,
		error,
		eventSource
	}
}

