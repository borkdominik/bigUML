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
package com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.manifest;

import org.eclipse.emfcloud.modelserver.edit.CommandContribution;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.commands.RenameElementContribution;
import com.google.inject.multibindings.MapBinder;

public class CommonManifest extends DiagramManifest implements CommandCodecContribution {
   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), this::contributeCommandCodec);
   }

   public void contributeCommandCodec(final MapBinder<String, CommandContribution> multibinder) {
      multibinder.addBinding(RenameElementContribution.TYPE).to(RenameElementContribution.class);
   }
}
