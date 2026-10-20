import { useEffect } from "react";

//updates the page title and meta description for SEO
export default function usePageMeta(title, description) {
	useEffect(() => {
		if (title) document.title = title;
		if (description) {
			const tag = document.querySelector('meta[name="description"]');
			if (tag) tag.setAttribute("content", description);
		}
	}, [title, description]);
}