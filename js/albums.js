var React = require('react');
var ReactDOM = require('react-dom');
import Slider from 'react-slick';
import axios from 'axios';

class AlbumSlider extends React.Component {

    constructor() {
        super();
        this.state = {
            data: '',
            loading: true,
            selected: 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        let number = e.target.attributes.getNamedItem('data-id').value;
        this.setState({
            selected: number
        });
        this.refs.slider.slickGoTo(number);
    }

    componentDidMount() {
        const url = 'https://jsonplaceholder.typicode.com/albums?_limit=5';
        axios.get(url)
            .then(response => {
                this.setState({
                    data: response.data
                });
                let count = 0;
                var self = this;
                this.state.data.forEach(function (album) {
                    let photo_url = 'https://jsonplaceholder.typicode.com/photos?albumId=' + album.id + '&_limit=2';
                    axios.get(photo_url)
                        .then(response => {
                            album.photos = response.data;
                            count++;
                            if (count === self.state.data.length) {
                                self.setState({loading: false});
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        var settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            vertical: true,
        };
        let content;
        let menu = [];
        if (this.state.loading) {
            content = <div>Loading...</div>
        } else {
            content = [];
            var slider_obj = this;
            var i=0;
            this.state.data.forEach(function(album) {
                let photos = [];
                menu.push(
                  <li key={album.id}>
                      <a href="#" className={(slider_obj.state.selected == i ? 'selected' : '')} onClick={slider_obj.handleClick} data-id={i}>{album.title}</a>
                  </li>
                );
                album.photos.forEach(function(photo) {
                    photos.push(
                      <div key={photo.id} className="photo">
                          <img src={photo.thumbnailUrl} alt={photo.title} />
                      </div>
                    );
                });
                content.push(
                    <div key={album.id} className="album">
                        <div className="album__pictures">
                            {photos}
                        </div>
                        <div className="album__description">
                            <h3>{album.title}</h3>
                        </div>
                    </div>
                );
                i++;
            });

        }

        return (
            <div className="album-set row">
                <div className="col-md-4">
                    <ul className="album-controls">
                        {menu}
                    </ul>
                </div>
                <div className="col-md-8">
                    <Slider ref='slider' {...settings}>
                        {content}
                    </Slider>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <AlbumSlider/>,
    document.getElementById('albums')
);
