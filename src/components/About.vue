<template>
  <div class="container">
    <div class="content-simple">
      <h1>About this project</h1>
      <ul id="faq">
        <li><a href="#what-is-orc">What is "ORC"?</a></li>
        <li><a href="#what-is-this">What is this?</a></li>
        <li><a href="#why-did-you-make-it">Why did you make it?</a></li>
        <li>
          <a href="#where-did-you-get-your-data-from"
            >Where did you get your data from?</a
          >
        </li>
        <li>
          <a href="#can-i-contribute"
            >My ORC plant is not in the list, can I add it?</a
          >
        </li>
        <li>
          <a href="#what-did-you-use-to-build-it"
            >What did you use to build it?</a
          >
        </li>
        <li><a href="#credits">Credits</a></li>
        <li><a href="#contact">Contact the Author</a></li>
        <li><a href="#disclaimer">Disclaimer</a></li>
      </ul>

      <h2 id="what-is-orc">What is "ORC"?</h2>
      <p>
        The Organic Rankine Cycle (ORC) technology is a way to convert heat into
        electricity. Its main applications are distributed electricity
        generation from renewable heat sources (geothermal, biomass, solar) and
        industrial energy efficiency (heat recovery from industrial processes).
      </p>

      <p>
        More information about the technology can be found on
        <a href="https://en.wikipedia.org/wiki/Organic_Rankine_cycle"
          >Wikipedia</a
        >
        or at the
        <a href="http://www.kcorc.org/en/">Knowledge Center on ORC</a>.
      </p>

      <h2 id="what-is-this">What is this?</h2>
      <p>
        The ORC World Map aims to monitor the progress of the Organic Rankine
        Cycle technology over the world.
      </p>

      <p>
        The objective is to provide an overview of the ORC market, at the
        industrial level. This means that small ORC plants at the lab scale or
        that are not connected to the grid have been ignored. An exception has
        been made for demo plants that are not connected to the grid but have a
        significant power output of several hundreds kilowatts / several
        megawatts.
      </p>
      <p>
        Some manufacturers do not publish their list of references and declined
        to take part to that survey. Therefore,
        <strong>this database is not 100% exhaustive</strong>. As of July 2016,
        we can consider that the remaining references do not represent more than
        20 MW of installed capacity.
      </p>
      <h2 id="why-did-you-make-it">Why did you make it?</h2>
      <p>
        The ORC technology is not very well-known and and the number of power
        plants that are based on that technology is underestimated. Combining
        all the known references onto one map can increase public awareness and
        motivate new motions and incentives favorable to ORC.
      </p>

      <h2 id="where-did-you-get-your-data-from">
        Where did you get your data from?
      </h2>
      <p>
        Most of the data used is publicly available on manufacturers' websites,
        through press articles or scientific papers. When possible, multiple
        sources have been used in order to cross-reference the information. The
        author thanks all the manufacturers that have taken part to that survey
        by sending their list of references.
      </p>

      <h2 id="can-i-contribute">
        My ORC plant is not in the list, can I add it?
      </h2>
      <p>
        Even if a lot of time and rigour has been spent trying to list all the
        ORC references, some information may be wrong or missing. Feel free to
        contact the author (see below) and changes will be made as quick as
        possible.
      </p>

      <h2 id="what-did-you-use-to-build-it">What did you use to build it?</h2>

      <p>Technologies used:</p>
      <ul>
        <li>
          <a href="https://www.python.org/">Python</a> for web scapping and data
          manipulation
        </li>
        <li><a href="http://jquery.com">VueJS</a></li>
        <li>
          <a href="http://code.google.com/apis/maps/documentation/javascript/"
            >Google Maps API V3</a
          >
        </li>
        <li>
          <a href="https://github.com/xkjyeah/vue-google-maps"
            >Vue-google-map</a
          >
        </li>
      </ul>

      <h2 id="credits">Credits</h2>
      <p>
        This site was built, designed and hosted entirely by
        <a href="http://ca.linkedin.com/in/thomastartiere"
          >Thomas Tarti&egrave;re</a
        >
        in his own free time for no money.
      </p>

      <p>
        Thank you to the ORC manufacturers that have taken part to the survey by
        sending their list of references :
      </p>

      <ul>
        <li>
          <a href="http://www.adoratec.com/companyprofilnav.html"
            >Adoractec / Maxxtec</a
          >
        </li>
        <li><a href="https://electratherm.com/">Electratherm</a></li>
        <li><a href="http://www.enertime.com/en/">Enertime</a></li>
        <li><a href="http://www.enogia.com/en/">Enogia</a></li>
        <li><a href="http://www.tas.com/">TAS</a></li>
        <li><a href="http://www.triogen.nl/">Triogen</a></li>
      </ul>

      <p>
        Special thanks to Tianhang Qi from Enertime for helping to get the data
        from Chinese manufacturers.
      </p>

      <h2 id="contact">Contact the Author</h2>

      <p>
        You can send me a message from the
        <router-link to="/contact">contact page</router-link>.
      </p>

      <br />
      <h2 id="disclaimer">Disclaimer</h2>
      <p>
        The information contained in this website is for general information
        purposes only. While the author endeavours to keep the information up to
        date and correct, the author makes no representations or warranties of
        any kind, express or implied, about the completeness, accuracy,
        reliability, suitability or availability with respect to the website or
        the information, products, services, or related graphics contained on
        the website for any purpose. Any reliance you place on such information
        is therefore strictly at your own risk.
      </p>

      <p>
        In no event the author will we be liable for any loss or damage
        including without limitation, indirect or consequential loss or damage,
        or any loss or damage whatsoever arising from loss of data or profits
        arising out of, or in connection with, the use of this website.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
</style>