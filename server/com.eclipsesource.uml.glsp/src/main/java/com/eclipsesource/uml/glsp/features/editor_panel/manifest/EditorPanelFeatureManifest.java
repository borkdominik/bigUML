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
package com.eclipsesource.uml.glsp.features.editor_panel.manifest;

import com.eclipsesource.uml.glsp.core.manifest.FeatureManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ClientActionContribution;
import com.eclipsesource.uml.glsp.features.editor_panel.handler.action.RequestEditorPanelHandler;
import com.eclipsesource.uml.glsp.features.editor_panel.handler.action.SetEditorPanelAction;

public class EditorPanelFeatureManifest extends FeatureManifest
   implements ClientActionContribution, ActionHandlerContribution {

   public static String ID = EditorPanelFeatureManifest.class.getSimpleName();

   @Override
   public String id() {
      return ID;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeClientActions((contribution) -> {
         contribution.addBinding().to(SetEditorPanelAction.class);
      });
      contributeActionHandlers((contribution) -> {
         contribution.addBinding().to(RequestEditorPanelHandler.class);
      });
   }

}
