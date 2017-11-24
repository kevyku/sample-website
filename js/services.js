var React = require('react');
var ReactDOM = require('react-dom');
import axios from 'axios';

class Services extends React.Component {
    constructor() {
        super();
        this.state = {
            data: '',
            loading: true
        };
    }

    componentDidMount() {
        const url = 'https://jsonplaceholder.typicode.com/posts?_limit=8';

        axios.get(url)
            .then(response => {
                this.setState({
                    data: response.data,
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
            });

    }

    render() {
        let rows = [];
        let contents;

        if (this.state.loading) {
            contents = <div className="loading">Loading...</div>;
        } else {
            let rowKey = 0;
            contents = this.state.data.reduce((services, p, i) => {
                let number = (i+1)+"";
                if(number.length < 2) number = "0" + number;
                rows.push(
                    <div key={i} className="col-lg-3 col-md-6">
                        <div className="service-box">
                            <span className="service-box__number">{number}</span>
                            <h3 className="service-box__headline">{p.title}</h3>
                            <p className="service-box__text">{p.body}</p>
                        </div>
                    </div>
                );
                if (i % 4 === 3) {
                    services.push(<div className="row" key={rowKey}>{rows}</div>);
                    rows = [];
                    rowKey++;
                }
                return services;
            }, []);
        }

        return (
            <div>
                {contents}
            </div>
        )
    }
}


ReactDOM.render(
    <Services/>,
    document.getElementById('service-box-container')
);