package com.eclipsesource.uml.modelserver.app;

import com.eclipsesource.uml.modelserver.UmlModelServerLauncher;
import org.eclipse.core.runtime.FileLocator;
import org.eclipse.core.runtime.Platform;
import org.eclipse.equinox.app.IApplication;
import org.eclipse.equinox.app.IApplicationContext;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;

/**
 * An application to start the UML GLSP Modelserver.
 */
public class ServerApplication implements IApplication {

	@Override
	public Object start(IApplicationContext context) throws Exception {
		String[] args = getArgs(context);
		String[] logArgs = addLogConfigArg(args);
		UmlModelServerLauncher.main(logArgs);
		System.in.read();
		return null;
	}

	private String[] getArgs(IApplicationContext context) {
		Object object = context.getArguments().get(IApplicationContext.APPLICATION_ARGS);
		if (object instanceof String[]) {
			return (String[]) object;
		}
		return new String[0];
	}

	private String[] addLogConfigArg(String[] args) {
		URL configPath = null;
		try {
			configPath = FileLocator
					.toFileURL(Platform.getBundle("com.eclipsesource.uml.modelserver.app").getEntry("resources/log4j2.xml"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		String logConfigParam = "-l=" + configPath.getFile();

		ArrayList<String> argsList = new ArrayList<>();
		argsList.addAll(Arrays.asList(args));
		argsList.add(logConfigParam);
		return argsList.toArray(new String[argsList.size()]);
	}

	@Override
	public void stop() {
		// Nothing
	}

}