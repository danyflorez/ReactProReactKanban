import React, {Component, PropTypes} from 'react';
import Card from './Card';

class List extends Component{
  render(){
    var cards = this.props.cards.map((card) => {
      return <Card key={card.id}
                   id={card.id}
                   title={card.title}
                   color={card.color}
                   description={card.description}
                   tasks={card.tasks}
                   taskCallbacks={this.props.taskCallbacks} />
    });

    return(
      <div className="list">
        <h1>{this.props.title}</h1>
        {cards}
      </div>
    )
  }
}

List.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  taskCallbacks: PropTypes.object
}

export default List;
