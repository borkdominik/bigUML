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
import com.eclipsesource.uml.modelserver.uml.behavior.BehaviorRegistry;
import com.eclipsesource.uml.modelserver.uml.behavior.cross_delete.CrossReferenceDeleter;
import com.eclipsesource.uml.modelserver.uml.command.copy_paste.CopyPasteContribution;
import com.eclipsesource.uml.modelserver.uml.command.create.edge.CreateEdgeCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.create.node.CreateNodeCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.create.node.CreateNodeCommandProviderRegistry;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProviderRegistry;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.reconnect.ReconnectElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProviderRegistry;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.representation.activity.ActivityManifest;
import com.eclipsesource.uml.modelserver.uml.representation.class_.ClassManifest;
import com.eclipsesource.uml.modelserver.uml.representation.communication.CommunicationManifest;
import com.eclipsesource.uml.modelserver.uml.representation.deployment.DeploymentManifest;
import com.eclipsesource.uml.modelserver.uml.representation.information_flow.InformationFlowManifest;
import com.eclipsesource.uml.modelserver.uml.representation.package_.PackageManifest;
import com.eclipsesource.uml.modelserver.uml.representation.state_machine.StateMachineManifest;
import com.eclipsesource.uml.modelserver.uml.representation.use_case.UseCaseManifest;
import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

public class ModelServerUmlModule extends AbstractModule implements CommandCodecContribution {
   @Override
   protected void configure() {
      super.configure();

      install(new CommunicationManifest());
      install(new ClassManifest());
      install(new UseCaseManifest());
      install(new PackageManifest());
      install(new StateMachineManifest());
      install(new DeploymentManifest());
      install(new ActivityManifest());
      install(new InformationFlowManifest());

      bind(CreateNodeCommandProviderRegistry.class).in(Singleton.class);
      bind(DeleteCommandProviderRegistry.class).in(Singleton.class);
      bind(UpdateCommandProviderRegistry.class).in(Singleton.class);
      bind(BehaviorRegistry.class).in(Singleton.class);

      bind(CrossReferenceDeleter.class).in(Singleton.class);

      contributeCommandCodec(binder(), (contributions) -> {
         contributions.addBinding(CreateNodeCommandContribution.TYPE).to(CreateNodeCommandContribution.class);
         contributions.addBinding(CreateEdgeCommandContribution.TYPE).to(CreateEdgeCommandContribution.class);
         contributions.addBinding(DeleteElementCommandContribution.TYPE).to(DeleteElementCommandContribution.class);
         contributions.addBinding(UpdateElementCommandContribution.TYPE).to(UpdateElementCommandContribution.class);
         contributions.addBinding(ReconnectElementCommandContribution.TYPE)
            .to(ReconnectElementCommandContribution.class);
         contributions.addBinding(CopyPasteContribution.TYPE).to(CopyPasteContribution.class);
      });
   }
}
