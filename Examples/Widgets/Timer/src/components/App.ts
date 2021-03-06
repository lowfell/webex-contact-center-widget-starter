/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DateTime, Duration } from "luxon";
import { html, LitElement, customElement, internalProperty, property, query, PropertyValues } from "lit-element";
import styles from "./App.scss";
import "./time-circle"
@customElement("timer-component")
export default class TimerComponent extends LitElement {
  @property({ type: String, reflect: true }) duration = ""
  @property({ type: Boolean }) paused = false
  @property({ type: String, attribute: "hours-color" }) hoursColor = "#0A78CC"
  @property({ type: String, attribute: "minutes-color" }) minutesColor = "#73A321"
  @property({ type: String, attribute: "seconds-color" }) secondsColor = "#875AE0"

  @internalProperty() durationData!: Duration;
  @internalProperty() remaining!: string;
  @internalProperty() remainingHours!: string;
  @internalProperty() remainingMinutes!: string;
  @internalProperty() remainingSeconds!: string;

  @query(".container") container!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    const savedTime = window.localStorage.getItem("time-remaining") ? window.localStorage.getItem("time-remaining")! : this.duration;
    this.resetDuration(savedTime)
    setInterval(() => {
      if (!this.paused) {
        this.durationData = this.durationData.minus({ seconds: 1 })
        this.remaining = this.durationData.toFormat('hh:mm:ss');
        this.remainingHours = this.remaining.split(":")[0]
        this.remainingMinutes = this.remaining.split(":")[1]
        this.remainingSeconds = this.remaining.split(":")[2]
        this.duration = this.remaining
        window.localStorage.setItem("time-remaining", this.remaining)
      }
    }, 1000)
  }
  
  disconnectedCallback(){
    super.disconnectedCallback();
  }

  resetDuration = (time:string) => {
    const durationData = time.split(":");
    const durationObj = { hours: Number(durationData[0]), minutes: Number(durationData[1]), seconds: Number(durationData[2]) }
    this.durationData = Duration.fromObject(durationObj)
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <div class="container" role="timer"
        aria-label="${this.remainingHours} hours, ${this.remainingMinutes} minutes, ${this.remainingSeconds} seconds remaining">
        <time-circle time-limit=8 time-left=${Number(this.remainingHours)} color=${this.hoursColor}>
          <div slot="time-unit" class="hours" aria-label="${this.remainingHours} hours">${this.remainingHours}h</div>
        </time-circle>
        <time-circle time-limit=60 time-left=${Number(this.remainingMinutes)} color=${this.minutesColor}>
          <div slot="time-unit" class="minutes" aria-label="${this.remainingMinutes} minutes">${this.remainingMinutes}m</div>
        </time-circle>
        <time-circle time-limit=60 time-left=${Number(this.remainingSeconds)} color=${this.secondsColor}>
          <div slot="time-unit" class="seconds" aria-label="${this.remainingSeconds} seconds">${this.remainingSeconds}s</div>
        </time-circle>
      </div>
    `;
  }
}
