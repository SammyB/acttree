module.exports = function(grunt) {

	// Innovative Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			compass: {
				files: ['sass/**/**/*.{scss,sass}'],
				tasks: ['compass:dev', 'cssmin']
			},
			js: {
				files: ['scripts/**/**/**/*.js','!scripts/main.min.js'],
				tasks: ['uglify']
			},
		},
		compass: {
			dev: {
				options: {
					sassDir: ['sass'],
					cssDir: ['css'],
					environment: 'production'
				}
			},
		},
		uglify: {
			all: {
				files: {
					'scripts/main.min.js': [
						'scripts/jquery.js',
						'scripts/jquery.ui.core.min.js',
						'scripts/jquery.ui.widget.min.js',
						'scripts/jquery.ui.accordion.min.js',
						'scripts/jquery.ui.tabs.min.js',
						'scripts/jquery.ba-bbq.min.js',
						'scripts/jquery.easing.1.3.js',
						'scripts/jquery.carouFredSel-6.2.1-packed.js',
						'scripts/jquery.timeago.js',
						'scripts/jquery.hint.js',
						'scripts/jquery.isotope.min.js',
						'scripts/jquery.iframe-transport.js',
						'scripts/jquery.fancybox-1.3.4.pack.js',
						'scripts/jquery.qtip.min.js',
						'scripts/jquery.blockUI.js',
						'scripts/cors/jquery.postmessage-transport.js',
						'scripts/cors/jquery.xdr-transport.js',
						'scripts/jquery.fileupload.js',
						'scripts/doubletaptogo.js',
						'scripts/main.js',
						'scripts/contact_form.js',
					]
				}
			},
		},
		cssmin: {
			combine: {
				files: {
					'css/output.min.css': [
						'css/reset.css',
						'css/superfish.css',
						'css/swiper.min.css',
						'css/jquery.fancybox.css',
						'css/jquery.fileupload.css',
						'css/jquery.qtip.css',
						'css/style.css',
						'css/responsive.css',
						'css/custom.css',
					]
				}
			}
		},
	});

	// Load the plugin
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['compass:dev' , 'cssmin', 'uglify', 'watch']);

};