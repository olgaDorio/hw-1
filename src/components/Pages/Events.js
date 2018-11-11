import React from "react";
import { RegistryConsumer } from '@bem-react/di';

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  componentDidMount() {
    fetch('https://agile-plains-47360.herokuapp.com/api/events')
      .then(r => r.json())
      .then(({ array }) => {
        this.setState({
          events: array,
        });
      })
      .catch(console.log);
  }

  render() {
    return (
      <main className={this.props.routeClassName}>
        <h1 className="Title">Лента событий</h1>
        {
          <RegistryConsumer>
            {registries => {
              const Card = registries['App'].get('Card');

              return this.state.events.map((event, index) => (
                <Card key={index} event={event}/>
              ))

            }}
          </RegistryConsumer>
        }
      </main>
    )
  }
}

export default Events;
