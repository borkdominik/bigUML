/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.manifest;

import org.eclipse.emfcloud.modelserver.edit.CommandContribution;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.interaction.CreateInteractionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.interaction.DeleteInteractionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline.CreateLifelineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline.DeleteLifelineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.CreateMessageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.DeleteMessageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.RenameMessageContribution;
import com.google.inject.multibindings.MapBinder;

public final class CommunicationManifest extends DiagramManifest implements CommandCodecContribution {
   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder());
   }

   @Override
   public void contributeCommandCodec(final MapBinder<String, CommandContribution> multibinder) {
      multibinder.addBinding(CreateInteractionContribution.TYPE).to(CreateInteractionContribution.class);
      multibinder.addBinding(DeleteInteractionContribution.TYPE).to(DeleteInteractionContribution.class);
      multibinder.addBinding(CreateLifelineContribution.TYPE).to(CreateLifelineContribution.class);
      multibinder.addBinding(DeleteLifelineContribution.TYPE).to(DeleteLifelineContribution.class);
      multibinder.addBinding(CreateMessageContribution.TYPE).to(CreateMessageContribution.class);
      multibinder.addBinding(DeleteMessageContribution.TYPE).to(DeleteMessageContribution.class);
      multibinder.addBinding(RenameMessageContribution.TYPE).to(RenameMessageContribution.class);
   }
}
