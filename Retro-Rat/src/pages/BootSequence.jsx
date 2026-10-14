import "./BootSequence.css";
import ratImg from "../assets/bootRat2.png";
import BootHeader from "../components/BootHeader";

export default function BootSequence() {
	return (
		<div className="boot">
			<BootHeader />

			<section className="boot-sequence">
				<p className="boot-init">&gt;Initializing system</p>

				<div className="boot-log">
					<p>
						<span className="boot-ok">[OK]</span> Kernel loaded
					</p>
					<p>
						<span className="boot-ok">[OK]</span> Disk mounted: /dev/rat0
					</p>
					<p>
						<span className="boot-ok">[OK]</span> Input devices detected
					</p>
				</div>

				<div className="boot-auth-start">
					<p>system online</p>
					<p>handshake established</p>
				</div>
			</section>

			<section className="boot-select">
				<p className="boot-select-label">SELECT VERIFICATION:</p>
				<div className="boot-select-options">
					<a className="boot-option" href="#login">
						&gt;Login
					</a>
					<a className="boot-option" href="#register">
						&gt;Register
					</a>
				</div>
			</section>
		</div>
	);
}
