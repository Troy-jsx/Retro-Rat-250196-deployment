import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function StudentNotice() {
	const [show, setShow] = useState(() => {
		try {
			return localStorage.getItem("studentNoticeSeen") !== "true";
		} catch {
			return true;
		}
	});

	const close = () => {
		try {
			localStorage.setItem("studentNoticeSeen", "true");
		} catch {}
		setShow(false);
	};

	return (
		<Modal show={show} onHide={close} centered>
			<Modal.Header closeButton>
				<Modal.Title>Heads up</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Retro Rat is a student project for Interactive Development 200 at Open
				Window. Listings are demo content and nothing here is actually for sale.
				Please don't enter real personal or payment details.
			</Modal.Body>
			<Modal.Footer>
				<Button variant="dark" onClick={close}>
					Got it
				</Button>
			</Modal.Footer>
		</Modal>
	);
}