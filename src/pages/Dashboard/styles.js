import styled, { keyframes } from 'styled-components';

const slideOutLeft = keyframes`
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
`;

export const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;

  display: flex;
  flex-direction: column;

  header {
    display: flex;
    align-self: center;
    align-items: center;

    button {
      border: 0;
      background: none;
    }

    strong {
      color: #fff;
      font-size: 24px;
      margin: 0 15px;
    }
  }

  ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
    margin-top: 30px;

    /* appear - on page load */
    &.slide-appear {
      opacity: 0;
      z-index: 1;
    }
    &.slide-appear.slide-appear-active {
      opacity: 1;
      transition: opacity 1000ms linear;
    }

    &.slide-enter {
      opacity: 0;
      transform: translateX(-300px);
      z-index: 1;
    }
    &.slide-enter.slide-enter-active {
      opacity: 1;
      transform: translateX(0);
      transition: opacity 3000ms linear 1000ms,
        transform 3000ms ease-in-out 1000ms;
    }

    /* slide exit */
    &.slide-exit {
      opacity: 1;
      transform: translateX(0);
    }
    &.slide-exit.slide-exit-active {
      opacity: 0;
      transform: translateX(300px);
      transition: opacity 1500ms linear, transform 1500ms ease-out;
    }
    &.slide-exit-done {
      opacity: 0;
    }
  }
`;

export const Time = styled.li`
  padding: 20px;
  border-radius: 4px;
  background: #fff;

  opacity: ${(props) => (props.past ? 0.6 : 1)};

  strong {
    display: block;
    color: ${(props) => (props.available ? '#999' : '#7159c1')};
    font-size: 20px;
    font-weight: normal;
  }

  span {
    display: block;
    margin-top: 3px;
    color: ${(props) => (props.available ? '#999' : '#666')};
  }
`;
