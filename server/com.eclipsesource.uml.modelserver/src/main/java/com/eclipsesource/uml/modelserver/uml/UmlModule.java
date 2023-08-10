/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml;

import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.command.create.CreateElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.manifest.ClassManifest;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.manifest.CommunicationManifest;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.manifest.PackageManifest;
import com.eclipsesource.uml.modelserver.uml.representation.usecase.UseCaseManifest;
import com.google.inject.AbstractModule;

public class UmlModule extends AbstractModule implements CommandCodecContribution {
   @Override
   protected void configure() {
      super.configure();

      install(new CommunicationManifest());
      install(new ClassManifest());
      install(new UseCaseManifest());
      install(new PackageManifest());

      contributeCommandCodec(binder(), (contributions) -> {
         contributions.addBinding(CreateElementCommandContribution.TYPE).to(CreateElementCommandContribution.class);
         contributions.addBinding(DeleteElementCommandContribution.TYPE).to(DeleteElementCommandContribution.class);
         contributions.addBinding(UpdateElementCommandContribution.TYPE).to(UpdateElementCommandContribution.class);
      });
   }
}
