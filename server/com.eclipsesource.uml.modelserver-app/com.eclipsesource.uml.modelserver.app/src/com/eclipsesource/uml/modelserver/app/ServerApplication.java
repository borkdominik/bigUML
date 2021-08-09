package com.eclipsesource.uml.modelserver.app;

import org.eclipse.equinox.app.IApplication;
import org.eclipse.equinox.app.IApplicationContext;

import com.eclipsesource.uml.modelserver.UmlModelServerLauncher;

/**
 * An application to start the UML GLSP Modelserver.
 */
public class ServerApplication implements IApplication {

	@Override
	public Object start(IApplicationContext context) throws Exception {
		System.setProperty("org.eclipse.jetty.util.log.class", "org.eclipse.jetty.util.log.StdErrLog");
		System.setProperty("org.eclipse.jetty.LEVEL", "WARN");
		String[] args = getArgs(context);
		UmlModelServerLauncher.main(args);
		System.in.read();
		return null;
	}

	private String[] getArgs(IApplicationContext context) {
		Object object = context.getArguments().get(IApplicationContext.APPLICATION_ARGS);
		if (object instanceof String[]) {
			return (String[])object;
		}
		return new String[0];
	}

	@Override
	public void stop() {
		// Nothing
	}

}
