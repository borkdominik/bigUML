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
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.interaction.AddInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.interaction.RemoveInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.interaction.SetInteractionNameCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline.AddLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline.RemoveLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline.SetLifelineNameCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message.AddMessageCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message.RemoveMessageCommandContribution;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message.SetMessageNameCommandContribution;
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
      multibinder.addBinding(AddInteractionCommandContribution.TYPE).to(AddInteractionCommandContribution.class);
      multibinder.addBinding(SetInteractionNameCommandContribution.TYPE)
         .to(SetInteractionNameCommandContribution.class);
      multibinder.addBinding(RemoveInteractionCommandContribution.TYPE).to(RemoveInteractionCommandContribution.class);
      multibinder.addBinding(AddLifelineCommandContribution.TYPE).to(AddLifelineCommandContribution.class);
      multibinder.addBinding(RemoveLifelineCommandContribution.TYPE).to(RemoveLifelineCommandContribution.class);
      multibinder.addBinding(SetLifelineNameCommandContribution.TYPE).to(SetLifelineNameCommandContribution.class);
      multibinder.addBinding(AddMessageCommandContribution.TYPE).to(AddMessageCommandContribution.class);
      multibinder.addBinding(RemoveMessageCommandContribution.TYPE).to(RemoveMessageCommandContribution.class);
      multibinder.addBinding(SetMessageNameCommandContribution.TYPE).to(SetMessageNameCommandContribution.class);
      multibinder.addBinding(CopyInteractionCommandContribution.TYPE).to(CopyInteractionCommandContribution.class);
      multibinder.addBinding(CopyLifelineWithMessagesCommandContribution.TYPE).to(
         CopyLifelineWithMessagesCommandContribution.class);
   }
}
