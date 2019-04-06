<template>
  <main class="container">
    <h1 class="mt-5">Contact the Author</h1>

    <b-form
      @reset="onReset"
      v-if="show"
      action="https://formspree.io/thomas.tartiere@gmail.com"
      method="POST"
    >
      <input type="hidden" name="_subject" value="Contact from ORC World Map">

      <b-form-group id="input-group-1">
        <b-form-input id="input-1" v-model="form.name" required placeholder="Your Name..."></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2">
        <b-form-input id="input-2" v-model="form.company" required placeholder="Company..."></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" description="We'll never share your email with anyone else.">
        <b-form-input
          id="input-3"
          v-model="form.email"
          type="email"
          required
          placeholder="Your email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4">
        <b-form-textarea
          id="textarea"
          v-model="form.message"
          placeholder="Write down your message..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <div>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
        <input type="hidden" name="_next" value="http://orc-world-map.org">
        <input type="text" name="_gotcha" style="display:none">
      </div>
    </b-form>
  </main>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      form: {
        email: "",
        name: "",
        company: "",
        message: ""
      },
      show: true
    };
  },
  methods: {
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.company = "";
      this.form.message = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>

<style scoped>
form {
  margin-top: 30px;
  text-align: left;
}

button {
  margin-right: 5px;
}
</style>