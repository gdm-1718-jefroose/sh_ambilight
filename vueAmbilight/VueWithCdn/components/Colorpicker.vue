<template id="color-picker-template">
    <div class="color-picker">
        <div class="color-picker__overlay" v-if="isVisible" v-on:click="hide"></div>
        <transition name="pop">
            <div class="color-picker__flyout" v-if="isVisible">
                <div class="color-chip" v-bind:style="{'background': color}">
                    <div class="color-chip__inner">
                        <h1 class="color-chip__title">HSL</h1>
                        <h3 class="color-chip__subtitle">{{ colorString }}</h3>
                    </div>
                </div>
                <div class="color-picker__inner">
                    <div class="control" v-bind:style="gradientH">
                        <input type="range" min="0" max="360" v-model="h" />
                    </div>
                    <div class="control" v-bind:style="gradientS">
                        <input type="range" min="0" max="100" v-model="s" />
                    </div>
                    <div class="control" v-bind:style="gradientL">
                        <input type="range" min="0" max="100" v-model="l" />
                    </div>
                </div>
            </div>
        </transition>
        <div class="swatch" v-bind:style="{'background': color}" v-on:click="toggle"></div>
    </div>
</template>
<script>
    export default {
        name: 'Colorpicker',
        props: ["change", "initial"],
        data: function() {
            return {
                isVisible: true,
                h: 265,
                s: 80,
                l: 99
            }
        },
        computed: {
            color: function() {
                var hsl = hsb2hsl(parseFloat(this.h) / 360, parseFloat(this.s) / 100, parseFloat(this.l) / 100)

                var c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%";

                var s = "hsl(" + c + ")";
                this.change({
                    color: s
                });
                return s;
            },
            colorString: function() {
                var c = this.h + ", " + this.s + "%, " + this.l + "%"
                return c;
            },
            gradientH: function() {
                var stops = [];
                for (var i = 0; i < 7; i++) {
                    var h = i * 60;

                    var hsl = hsb2hsl(parseFloat(h / 360), parseFloat(this.s) / 100, parseFloat(this.l / 100))

                    var c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"
                    stops.push("hsl(" + c + ")")
                }

                return {
                    backgroundImage: "linear-gradient(to right, " + stops.join(', ') + ")"
                }
            },
            gradientS: function() {
                var stops = [];
                var c;
                var hsl = hsb2hsl(parseFloat(this.h / 360), 0, parseFloat(this.l / 100))
                c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"
                stops.push("hsl(" + c + ")")

                var hsl = hsb2hsl(parseFloat(this.h / 360), 1, parseFloat(this.l / 100))
                c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"
                stops.push("hsl(" + c + ")")

                return {
                    backgroundImage: "linear-gradient(to right, " + stops.join(', ') + ")"
                }
            },

            gradientL: function() {
                var stops = [];
                var c;

                var hsl = hsb2hsl(parseFloat(this.h / 360), 0, 0)
                c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"
                stops.push("hsl(" + c + ")")

                var hsl = hsb2hsl(parseFloat(this.h / 360), parseFloat(this.s / 100), 1)

                c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"
                stops.push("hsl(" + c + ")")

                return {
                    backgroundImage: "linear-gradient(to right, " + stops.join(', ') + ")"

                }
            }
        },
        methods: {

            show: function() {
                this.isVisible = true;
            },
            hide: function() {
                this.isVisible = false;
            },
            toggle: function() {
                this.isVisible = !this.isVisible;
            }
        },

        mounted: function () {
            this.h = parseInt(Math.random() * 360)
        }
    }
</script>