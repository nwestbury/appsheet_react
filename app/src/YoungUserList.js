import React from 'react';
import PropTypes from 'prop-types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import './Loader.css';


const styles = theme => ({
  inline: {
    display: 'inline',
  },
  cardMedia: {
    flex: 1,
    maxWidth: 300,
    margin: '0 auto',
  },
  card: {
    display: 'flex',
    marginBottom: 10,
  },
  cardDetails: {
    flex: 3,
  },
});

const fetchJSON = (url) => {
  return fetch(url)
    .then(resp => resp.json())
    .catch(() => null);
}

const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
}

class YoungUserList extends React.Component {

  state = {
    users: [],
    loading: true,
  }
  baseurl = 'https://appsheettest1.azurewebsites.net/sample/';

  constructor(props) {
    super(props);

    this.fetchToken('');
  }

  fetchDetails = (id) => {
    return fetchJSON(this.baseurl + `detail/${id}`);
  }

  addUserDetails = (details) => {
    // Validate and format the user details
    const validUserDetails = details.reduce((acc, detail) => {
      if (!detail) return acc;

      const phoneNum = parsePhoneNumberFromString(detail.number, 'US');
      if (!phoneNum) return acc;

      // Note: probably isValid() should be used for a "real" application
      if (!phoneNum.isPossible()) return acc;
      acc.push(Object.assign({}, detail, {
        phonenum: phoneNum.number, // normalize phone number to E.164 format
        name: capitalizeFirstLetter(detail.name),
      }));
      return acc;
    }, []);

    const users = this.state.users.concat(validUserDetails);
    users.sort((a, b) => a.age - b.age);

    this.setState({users});
  }

  fetchToken = (token) => {
    fetchJSON(this.baseurl + `list?token=${token}`).then((resp) => {

      // Fetch details in bulk so that we only update state once per list page
      const promiseIds = resp.result.map((id) => this.fetchDetails(id));
      Promise.all(promiseIds)
        .then(this.addUserDetails)
        .then(() => {
          if (!resp.token) { // set loading to false after details loaded
            this.setState({loading: false});
          }
        });

      if (resp.token) {
        this.fetchToken(resp.token);
      }
    });
  }

  render() {
    const { classes, numYoungest } = this.props;
    const { users, loading } = this.state;
    const youngUserDetails = users.slice(0, numYoungest);

    if (loading) {
      return (
        <Grid container spacing={40}>
          <Grid item xs={12}>
            <div className="loader">
              <div></div><div></div><div></div><div></div>
            </div>
          </Grid>
        </Grid>
      );
    }

    return (
      <React.Fragment>
        {youngUserDetails.map((detail, index) => {
          return (
            <Card className={classes.card} key={index}>
              <Grid container spacing={40} className={classes.cardGrid}>
                <Grid item xs={12} sm={4}>
                    <CardMedia
                      component="img"
                      alt="User Profile Picture"
                      className={classes.cardMedia}
                      image={detail.photo}
                      title="User Profile Picture"
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <CardContent className={classes.cardDetails}>
                      <Typography component="h2" variant="h5">
                        {detail.name}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {`Age: ${detail.age} Phone number: ${detail.phonenum}`}
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                        {detail.bio}
                      </Typography>
                    </CardContent>
                  </Grid>
              </Grid>
            </Card>
          )}
        )}
      </React.Fragment>
    );
  }
}

YoungUserList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(YoungUserList);