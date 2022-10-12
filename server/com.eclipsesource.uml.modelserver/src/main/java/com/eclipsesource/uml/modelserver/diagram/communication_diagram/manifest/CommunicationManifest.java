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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.manifest;

import org.eclipse.emfcloud.modelserver.edit.CommandContribution;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.interaction.AddInteractionContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.interaction.RemoveInteractionContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.interaction.SetInteractionNameContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline.AddLifelineContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline.RemoveLifelineContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline.SetLifelineNameContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message.AddMessageContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message.RemoveMessageContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message.SetMessageNameContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.feature.copy_paste.interaction.CopyInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.feature.copy_paste.lifeline.CopyLifelineWithMessagesCommandContribution;
import com.google.inject.multibindings.MapBinder;

public class CommunicationManifest extends DiagramManifest implements CommandCodecContribution {
   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder());
   }

   @Override
   public void contributeCommandCodec(final MapBinder<String, CommandContribution> multibinder) {
      multibinder.addBinding(AddInteractionContribution.TYPE).to(AddInteractionContribution.class);
      multibinder.addBinding(SetInteractionNameContribution.TYPE)
         .to(SetInteractionNameContribution.class);
      multibinder.addBinding(RemoveInteractionContribution.TYPE).to(RemoveInteractionContribution.class);
      multibinder.addBinding(AddLifelineContribution.TYPE).to(AddLifelineContribution.class);
      multibinder.addBinding(RemoveLifelineContribution.TYPE).to(RemoveLifelineContribution.class);
      multibinder.addBinding(SetLifelineNameContribution.TYPE).to(SetLifelineNameContribution.class);
      multibinder.addBinding(AddMessageContribution.TYPE).to(AddMessageContribution.class);
      multibinder.addBinding(RemoveMessageContribution.TYPE).to(RemoveMessageContribution.class);
      multibinder.addBinding(SetMessageNameContribution.TYPE).to(SetMessageNameContribution.class);
      multibinder.addBinding(CopyInteractionCommandContribution.TYPE).to(CopyInteractionCommandContribution.class);
      multibinder.addBinding(CopyLifelineWithMessagesCommandContribution.TYPE).to(
         CopyLifelineWithMessagesCommandContribution.class);
   }
}
